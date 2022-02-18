import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateFormUrl, CreateFormUrlResponse, Verification, VerificationStatus } from 'src/kycaid/dto/kycaid.dto'
import { KYCAidService } from 'src/kycaid/kycaid.service'
import User, { UserType } from 'src/user/entity/user.entity'
import { UserService } from '../user/user.service'
import { ObjectID } from 'typeorm'

@Injectable()
export class KYCService {
  private readonly personFormId
  private readonly companyFormId

  constructor(private configService: ConfigService, private userService: UserService, private kycAidService: KYCAidService) {
    this.personFormId = this.configService.get<string>('kyc.personFormId')
    this.companyFormId = this.configService.get<string>('kyc.companyFormId')
  }

  async createFormUrl(userId: ObjectID, userType: UserType, redirectUrl?: string) {
    const user: User = await this.userService.getUserById(userId)

    const userTypeKey = userType.toLowerCase()
    let userStatus, isUserVefified

    if (user[userTypeKey].verification) {
      userStatus = user[userTypeKey].verification.status
      isUserVefified = user[userTypeKey].verification.verified
    } else {
      userStatus = null
      isUserVefified = false
    }

    if (!userStatus || !user[userTypeKey].formUrl || (userStatus == VerificationStatus.COMPLETED && !isUserVefified)) {
      return this.requestFormUrl(user, userType, redirectUrl)
    }

    if (userStatus == VerificationStatus.UNUSED && user[userTypeKey].formUrl) {
      return { formUrl: user[userTypeKey].formUrl }
    }

    if (userStatus == VerificationStatus.COMPLETED && isUserVefified) {
      throw new BadRequestException(`The KYC verification for ${userId} (${userType.toLowerCase()}) has been completed`)
    }

    throw new BadRequestException(`The KYC verification for ${userId} (${userType.toLowerCase()}) is pending`)
  }

  private async requestFormUrl(user: User, userType: UserType, redirectUrl: string) {
    const formId = this.getFormIdByUserType(userType)
    const body: CreateFormUrl = {
      external_applicant_id: user._id.toString(),
      redirect_url: redirectUrl,
    }

    const fetchedData = await this.kycAidService.createFormUrl(formId, body)
    await this.updateUserData(user, userType, fetchedData)

    return { formUrl: fetchedData.form_url }
  }

  private async updateUserData(user: User, userType: UserType, data: CreateFormUrlResponse) {
    await this.userService.updateUser({
      _id: user._id,
      [userType.toLowerCase()]: {
        verificationId: data.verification_id,
        formUrl: data.form_url,
        verification: {
          ...user.company.verification,
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

  async refreshVerification(userId: ObjectID) {
    const user = await this.userService.getUserById(userId)
    if (!user.person.verificationId && !user.company.verificationId) {
      throw new BadRequestException('No verification data found. You need to start verification at first.')
    }

    let userTypeKey, validKeys
    if (user.person.verificationId) {
      validKeys = ['first_name', 'middle_name', 'last_name', 'residence_country', 'documents']
      userTypeKey = 'person'
    } else if (user.company.verificationId) {
      validKeys = ['companyName', 'registration_country', 'business_activity', 'documents']
      userTypeKey = 'company'
    }

    const fetchedVerificationData = await this.kycAidService.getVerification(user[userTypeKey].verificationId)

    const applicantId = fetchedVerificationData.applicant_id || user[userTypeKey].verification.applicant_id

    let fetchedApplicantData
    if (applicantId) {
      fetchedApplicantData = await this.kycAidService.getApplicant(applicantId)
    } else {
      fetchedApplicantData = {
        documents: [{ front_side: null, back_side: null }],
      }
    }

    const actualUserStatus = fetchedApplicantData.verification_status

    Object.keys(fetchedApplicantData).forEach((key) => validKeys.includes(key) || delete fetchedApplicantData[key])
    delete fetchedVerificationData.verification_id

    await this.userService.updateUser({
      _id: user._id,
      [userTypeKey]: {
        verification: {
          ...user[userTypeKey].verification,
          ...fetchedVerificationData,
          status: actualUserStatus == 'pending' || actualUserStatus == 'processing' ? 'pending' : fetchedVerificationData.status,
        },
        data: {
          ...fetchedApplicantData,
          documents: {
            front_side: fetchedApplicantData.documents[0].front_side || null,
            back_side: fetchedApplicantData.documents[0].back_side || null,
          },
        },
      },
    })

    const fetchedUser = await this.userService.getUserById(userId)

    return {
      person: { verification: { ...fetchedUser.person.verification }, data: { ...fetchedUser.person.data } },
      company: { verification: { ...fetchedUser.company.verification }, data: { ...fetchedUser.company.data } },
    }
  }

  async callbackHandler(dto: Verification) {
    const user: User = await this.userService.getUserByVerificationId(dto.verification_id)

    let userType, validKeys
    if (user.person.verificationId == dto.verification_id) {
      userType = 'person'
      validKeys = ['first_name', 'middle_name', 'last_name', 'residence_country', 'documents']
    } else if (user.company.verificationId == dto.verification_id) {
      userType = 'company'
      validKeys = ['companyName', 'registration_country', 'business_activity', 'documents']
    } else {
      throw new BadRequestException('Cannot resolve the user by verification id')
    }

    const fetchedData = await this.kycAidService.getApplicant(dto.applicant_id)

    Object.keys(fetchedData).forEach((key) => validKeys.includes(key) || delete fetchedData[key])
    delete dto.verification_id

    await this.userService.updateUser({
      ...user,
      [userType]: {
        ...user[userType],
        verification: {
          ...user[userType].verification,
          ...dto,
        },
        data: {
          ...fetchedData,
          documents: {
            front_side: fetchedData.documents[0].front_side || null,
            back_side: fetchedData.documents[0].back_side || null,
          },
        },
      },
    })
  }
}
