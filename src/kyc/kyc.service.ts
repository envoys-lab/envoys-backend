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

  async getFormUrl(userId: ObjectID, userType: UserType, redirectUrl?: string) {
    const user: User = await this.userService.getUserById(userId)

    if (userType == UserType.PERSON) {
      if (
        !user.personVerification.status ||
        (user.personVerification.status == VerificationStatus.COMPLETED && !user.personVerification.verified)
      ) {
        const fetchedData = await this.createFormUrl(userId, userType, redirectUrl)

        await this.userService.updateUser({
          _id: user._id,
          formURLs: { ...user.formURLs, personFormUrl: fetchedData.form_url },
          personVerificationId: fetchedData.verification_id,
          personVerification: {
            ...user.personVerification,
            status: VerificationStatus.UNUSED,
            verified: false,
          },
        })

        return { formUrl: fetchedData.form_url }
      } else if (user.personVerification.status == VerificationStatus.UNUSED) {
        return { formUrl: user.formURLs.personFormUrl }
      } else {
        throw new BadRequestException('It is impossible to get formUrl')
      }
    } else if (userType == UserType.COMPANY) {
      if (
        !user.companyVerification.status ||
        (user.companyVerification.status == VerificationStatus.COMPLETED && !user.companyVerification.verified)
      ) {
        const fetchedData = await this.createFormUrl(userId, userType, redirectUrl)

        await this.userService.updateUser({
          _id: user._id,
          formURLs: { ...user.formURLs, companyFormUrl: fetchedData.form_url },
          companyVerificationId: fetchedData.verification_id,
          companyVerification: {
            ...user.companyVerification,
            status: VerificationStatus.UNUSED,
            verified: false,
          },
        })

        return { formUrl: fetchedData.form_url }
      } else if (user.companyVerification.status == VerificationStatus.UNUSED) {
        return { formUrl: user.formURLs.companyFormUrl }
      } else {
        throw new BadRequestException('It is impossible to get formUrl')
      }
    }
  }

  private async createFormUrl(userId: ObjectID, userType: UserType, redirectUrl: string) {
    const formId = this.getFormIdByUserType(userType)
    const body: CreateFormUrl = {
      external_applicant_id: userId.toString(),
      redirect_url: redirectUrl,
    }

    return (await this.kycAidService.createFormUrl(formId, body)) as CreateFormUrlResponse
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
    if (!user.companyVerificationId && !user.personVerificationId) {
      throw new BadRequestException('No verification data found. You need to start verification at first.')
    }

    if (user.personVerificationId) {
      const fetchedDataForPerson = await this.kycAidService.getVerification(user.personVerificationId)
      const { verification_id, ...newDto } = fetchedDataForPerson

      this.userService.updateUser({
        _id: user._id,
        personVerification: {
          ...user.personVerification,
          ...newDto,
        },
      })
    }
    if (user.companyVerificationId) {
      const fetchedDataForCompany = await this.kycAidService.getVerification(user.companyVerificationId)
      const { verification_id, ...newDto } = fetchedDataForCompany

      this.userService.updateUser({
        _id: user._id,
        companyVerification: {
          ...user.companyVerification,
          ...newDto,
        },
      })
    }

    const fetchedUser = await this.userService.getUserById(userId)

    return {
      companyVerification: { ...fetchedUser.companyVerification },
      personVerification: { ...fetchedUser.personVerification },
    }
  }

  async callbackHandler(dto: Verification) {
    const user: User = await this.userService.getUserByVerificationId(dto.verification_id)

    if (user.companyVerificationId == dto.verification_id) {
      const { verification_id, ...newDto } = dto

      await this.userService.updateUser({
        companyVerificationId: user.companyVerificationId,
        companyVerification: {
          ...user.companyVerification,
          ...newDto,
        },
      })
    } else if (user.personVerificationId == dto.verification_id) {
      const { verification_id, ...newDto } = dto

      await this.userService.updateUser({
        personVerificationId: user.personVerificationId,
        personVerification: {
          ...user.personVerification,
          ...newDto,
        },
      })
    } else {
      throw new BadRequestException('Cannot find user')
    }
  }
}
