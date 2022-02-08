import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GetFormUrl, KYCAidCallback } from 'src/kycaid/dto/kycaid.dto'
import { VerificationStatus } from 'src/kycaid/interface/kycaid.db.structure'
import { GetFormUrlResponse } from 'src/kycaid/interface/kycaid.respond'
import { KYCAidService } from 'src/kycaid/kycaid.service'
import { UserType } from 'src/users/entities/user.entity'
import { KYCDatabase } from './kyc.repository'

@Injectable()
export class KYCService {
  constructor(private configService: ConfigService, private repository: KYCDatabase, private kycAidService: KYCAidService) {}

  async getFormUrl(userType: UserType, dto: GetFormUrl) {
    let form_id
    if (userType == UserType.PERSON) {
      form_id = this.configService.get<number>('kyc.personFormId')
    }
    if (userType == UserType.COMPANY) {
      form_id = this.configService.get<number>('kyc.companyFormId')
    } // dto.rederict_url
    const fetchedData: GetFormUrlResponse = await this.kycAidService.getFormUrl(form_id, dto)

    this.repository.updateUser({
      userWalletAddress: dto.external_applicant_id,
      userType: userType,
      verification_id: fetchedData.verification_id,
      verification: {
        status: VerificationStatus.UNUSED,
        verified: false,
      },
    })

    return { form_url: fetchedData.form_url }
  }

  async getVerification(userWalletAddress: string) {
    const fetchedUser = await this.repository.getUserByUserWalletAddress(userWalletAddress)
    const fetchedData = await this.kycAidService.getVerification(fetchedUser.verification_id)

    this.repository.updateUser({
      userWalletAddress: userWalletAddress,
      verification_id: fetchedData.verification_id,
      verification: {
        applicant_id: fetchedData.applicant_id,
        status: fetchedData.status,
        verified: fetchedData.verified,
        verifications: fetchedData.verifications,
      },
    })

    return fetchedData
  }

  callbackHandler(dto: KYCAidCallback) {
    this.repository.updateUser({
      verification_id: dto.verification_id,
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
