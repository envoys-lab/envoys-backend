import { HttpService } from '@nestjs/axios'
import { Injectable, HttpException } from '@nestjs/common'
import { UserType, VerificationStatus } from 'src/kycaid/enum/user.enum'
import { GetFormUrl, KYCAidCallback } from './dto/kycaid.dto'
import { GetFormUrlResponse, GetVerificationResponse } from './interface/kycaid.respond'
import { KydAidUrlHandler } from './kyc.url.handler'
import { KYCAidDatabase } from './kycaid.repository'

@Injectable()
export class KYCAidService {
  constructor(private httpService: HttpService, private repository: KYCAidDatabase, private urlHandler: KydAidUrlHandler) {}

  async getFormUrl(type: UserType, dto: GetFormUrl) {
    const response = await this.httpService.axiosRef
      .post(this.urlHandler.getFormUrl(type), dto)
      .then((response) => {
        const fetchedData: GetFormUrlResponse = response.data
        this.repository.updateUser(
          {
            userType: type,
            verification_id: fetchedData.verification_id,
            verification: {
              status: VerificationStatus.unused,
              verified: false,
            },
          },
          dto.external_applicant_id,
        )

        return { form_url: fetchedData.form_url }
      })
      .catch((error) => {
        throw new HttpException(error.response.data, error.response.status)
      })
    return response
  }

  async getVerification(userWalletAddress: string) {
    const verification_id = await (await this.repository.getUser(userWalletAddress, null)).verification_id
    const response = await this.httpService.axiosRef
      .get(this.urlHandler.getVerificationUrl(verification_id))
      .then((response) => {
        const fetchedData: GetVerificationResponse = response.data
        this.repository.updateUser(
          {
            verification_id: fetchedData.verification_id,
            verification: {
              applicant_id: fetchedData.applicant_id,
              status: fetchedData.status,
              verified: fetchedData.verified,
              verifications: fetchedData.verifications,
            },
          },
          userWalletAddress,
        )

        return fetchedData
      })
      .catch((error) => {
        throw new HttpException(error.response.data, error.response.status)
      })

    return response
  }

  async processCallback(dto: KYCAidCallback) {
    const user = await this.repository.getUser(null, dto.verification_id)

    await this.repository.updateUser(
      {
        verification_id: dto.verification_id,
        verification: {
          request_id: dto.request_id,
          applicant_id: dto.applicant_id,
          type: dto.type,
          status: dto.status,
          verified: dto.verified,
          verifications: dto.verifications,
        },
      },
      user.userWalletAddress,
    )

    return dto
  }
}
