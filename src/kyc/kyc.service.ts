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
    this.personFormId = this.configService.get<number>('kyc.personFormId')
    this.companyFormId = this.configService.get<number>('kyc.companyFormId')
  }

  async createFormUrl(userId: ObjectID, userType: UserType, redirectUrl?: string) {
    const user: User = await this.userService.getUserById(userId)
    const formId = this.getFormIdByUserType(userType)

    const body: CreateFormUrl = {
      external_applicant_id: user._id.toString(),
      redirect_url: redirectUrl,
    }

    const fetchedData: CreateFormUrlResponse = await this.kycAidService.createFormUrl(formId, body)

    if (userType == UserType.PERSON) {
      await this.userService.updateUser({
        _id: user._id,
        personVerificationId: fetchedData.verification_id,
        personVerification: {
          status: VerificationStatus.UNUSED,
          verified: false,
        },
      })
    } else if (userType == UserType.COMPANY) {
      await this.userService.updateUser({
        _id: user._id,
        companyVerificationId: fetchedData.verification_id,
        companyVerification: {
          status: VerificationStatus.UNUSED,
          verified: false,
        },
      })
    }

    return { formUrl: fetchedData.form_url }
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
    if (!user.companyVerificationId || !user.personVerificationId) {
      throw new BadRequestException('No verification data found. You need to start verification at first.')
    }

    let fetchedDataForPerson, fetchedDataForCompany
    if (user.companyVerificationId) {
      fetchedDataForPerson = await this.kycAidService.getVerification(user.personVerificationId)
    }
    if (user.personVerificationId) {
      fetchedDataForCompany = await this.kycAidService.getVerification(user.companyVerificationId)
    }

    return this.userService.updateUser({
      _id: user._id,
      personVerification: {
        applicant_id: fetchedDataForPerson.applicant_id,
        status: fetchedDataForPerson.status,
        verified: fetchedDataForPerson.verified,
        verifications: fetchedDataForPerson.verifications,
      },
      companyVerification: {
        applicant_id: fetchedDataForCompany.applicant_id,
        status: fetchedDataForCompany.status,
        verified: fetchedDataForCompany.verified,
        verifications: fetchedDataForCompany.verifications,
      },
    })
  }

  async callbackHandler(dto: Verification) {
    const user = await this.userService.getUserByVerificationId(dto.verification_id)
    console.log(user)
    if (user.companyVerificationId == dto.verification_id) {
      await this.userService.updateUser({
        companyVerificationId: dto.verification_id,
        companyVerification: {
          request_id: dto.request_id,
          applicant_id: dto.applicant_id,
          type: dto.type,
          status: dto.status,
          verified: dto.verified,
          verifications: dto.verifications,
        },
      })
    } else if (user.personVerificationId == dto.verification_id) {
      await this.userService.updateUser({
        personVerificationId: dto.verification_id,
        personVerification: {
          request_id: dto.request_id,
          applicant_id: dto.applicant_id,
          type: dto.type,
          status: dto.status,
          verified: dto.verified,
          verifications: dto.verifications,
        },
      })
    } else {
      throw new BadRequestException('Cannot find user')
    }
  }
}
