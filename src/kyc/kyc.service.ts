import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  CreateFormUrl,
  CreateFormUrlResponse,
  GetApplicantResponse,
  Verification,
  VerificationStatus,
} from '../kycaid/dto/kycaid.dto'
import { KYCAidService } from '../kycaid/kycaid.service'
import { ApplicantModel, getUserKeyByType, User, userCompanyKey, userPersonKey, UserType } from '../user/entity/user.entity'
import { UserService } from '../user/user.service'
import { ObjectID } from 'typeorm'
import { FormUrlResponse } from './dto/kyc.controller.dto'

@Injectable()
export class KYCService {
  private readonly personFormId
  private readonly companyFormId

  constructor(private configService: ConfigService, private userService: UserService, private kycAidService: KYCAidService) {
    this.personFormId = this.configService.get<string>('kyc.personFormId')
    this.companyFormId = this.configService.get<string>('kyc.companyFormId')
  }

  async createFormUrl(userId: ObjectID, userType: UserType, redirectUrl?: string): Promise<FormUrlResponse> {
    const user: User = await this.userService.getUserById(userId)

    const userData = user[getUserKeyByType(userType)]
    const userStatus = userData.verification ? userData.verification.status : null
    const isUserVerified = userData.verification ? userData.verification.verified : false

    if (userStatus == VerificationStatus.PENDING && userData.formUrl) {
      throw new BadRequestException(`The KYC [${userType}] verification for ${userId} is pending`)
    }

    if (userStatus == VerificationStatus.COMPLETED && isUserVerified) {
      throw new BadRequestException(`The KYC [${userType}] verification for ${userId} has been completed.`)
    }

    if (userData.formUrl && userStatus == VerificationStatus.UNUSED) {
      return { formUrl: userData.formUrl }
    }

    return this.requestFormUrl(user, userType, redirectUrl)
  }

  private async requestFormUrl(user: User, userType: UserType, redirectUrl: string): Promise<FormUrlResponse> {
    const formId = this.getFormIdByUserType(userType)
    const body: CreateFormUrl = {
      external_applicant_id: user._id.toString(),
      redirect_url: redirectUrl,
    }

    const fetchedData = await this.kycAidService.createFormUrl(formId, body)
    await this.updateUserData(user, userType, fetchedData)

    return { formUrl: fetchedData.form_url }
  }

  private async updateUserData(user: User, userType: UserType, data: CreateFormUrlResponse): Promise<void> {
    const userKey = getUserKeyByType(userType)

    await this.userService.updateUser({
      _id: user._id,
      [userKey]: {
        verificationId: data.verification_id,
        formUrl: data.form_url,
        verification: {
          ...user[userKey].verification,
          status: VerificationStatus.UNUSED,
          verified: false,
        },
      },
    })
  }

  private getFormIdByUserType(userType: UserType): string {
    switch (userType) {
      case UserType.PERSON:
        return this.personFormId
      case UserType.COMPANY:
        return this.companyFormId
    }
  }

  async refreshVerification(userId: ObjectID): Promise<User> {
    const user: User = await this.userService.getUserById(userId)

    if (!user[userCompanyKey].verificationId && !user[userPersonKey].verificationId) {
      throw new BadRequestException('No verification data found. You need to start verification at first.')
    }

    for (const userType in UserType) {
      await this.refreshVerificationByType(user, UserType[userType])
    }

    return this.userService.getUserById(userId)
  }

  private async refreshVerificationByType(user: User, userType: UserType): Promise<void> {
    const userKey = getUserKeyByType(userType)
    const userData = user[userKey]

    if (!userData.verificationId) {
      return
    }

    const fetchedVerificationData = await this.kycAidService.getVerification(userData.verificationId)
    delete fetchedVerificationData.verification_id

    let fetchedApplicantData: GetApplicantResponse = {
      documents: [{ front_side: null, back_side: null }],
    }

    const applicantId = fetchedVerificationData.applicant_id || userData.verification.applicant_id
    if (applicantId) {
      fetchedApplicantData = await this.kycAidService.getApplicant(applicantId)
    }

    const actualUserStatus: string = fetchedApplicantData.verification_status ?? ''
    const verificationStatus =
      actualUserStatus == 'pending' || actualUserStatus == 'processing' ? 'pending' : fetchedVerificationData.status

    await this.userService.updateUser({
      _id: user._id,
      [userKey]: {
        ...user[userKey],
        verification: {
          ...user[userKey].verification,
          ...fetchedVerificationData,
          status: verificationStatus,
        },
        applicant: {
          ...user[userKey].applicant,
          ...fetchedApplicantData,
        },
      },
    })
  }

  async callbackHandler(dto: Verification): Promise<void> {
    const user: User = await this.userService.getUserByVerificationId(dto.verification_id)
    const userKey = KYCService.getUserKeyByVerificationId(user, dto.verification_id)

    const applicant: ApplicantModel = dto.applicant
    delete dto.applicant
    delete dto.verification_id

    await this.userService.updateUser({
      ...user,
      [userKey]: {
        ...user[userKey],
        verification: {
          ...user[userKey].verification,
          ...dto,
        },
        applicant: {
          ...user[userKey].applicant,
          ...applicant,
        },
      },
    })
  }

  static getUserKeyByVerificationId(user: User, verificationId: string): string {
    if (user[userPersonKey].verificationId == verificationId) {
      return userPersonKey
    }

    if (user[userCompanyKey].verificationId == verificationId) {
      return userCompanyKey
    }

    throw new NotFoundException(`Cannot find user verification data by verification id: ${verificationId}`)
  }
}
