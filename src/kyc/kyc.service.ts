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

    await this.userService.updateUser({
      _id: user._id,
      userType: userType,
      verificationId: fetchedData.verification_id,
      verification: {
        status: VerificationStatus.UNUSED,
        verified: false,
      },
    })

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
    if (!user.verificationId) {
      throw new BadRequestException('No verification data found. You need to start verification at first.')
    }

    const fetchedData = await this.kycAidService.getVerification(user.verificationId)

    return this.userService.updateUser({
      _id: user._id,
      verification: {
        applicant_id: fetchedData.applicant_id,
        status: fetchedData.status,
        verified: fetchedData.verified,
        verifications: fetchedData.verifications,
      },
    })
  }

  async callbackHandler(dto: Verification) {
    await this.userService.updateUser({
      verificationId: dto.verification_id,
      verification: {
        request_id: dto.request_id,
        applicant_id: dto.applicant_id,
        type: dto.type,
        status: dto.status,
        verified: dto.verified,
        verifications: dto.verifications,
      },
    })
  }
}
