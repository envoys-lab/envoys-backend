import { HttpService } from '@nestjs/axios'
import { Injectable, HttpException, BadRequestException } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import KYCConfig from 'src/config/kycconfig'
import { UsersService } from 'src/users/users.service'
import { GetFormUrl, GetVerification, KYCCallback } from './dto/kyc.dto'
import { GetFormUrlResponse, GetVerificationResponse } from './interfaces/kyc.respond'

@Injectable()
export class KYCService {
  constructor(private httpService: HttpService, private readonly usersService: UsersService, private kycConfig: KYCConfig) {}

  async getFormUrl(form_id: string, dto: GetFormUrl) {
    const url = `https://api.kycaid.com/forms/${form_id}/urls`
    try {
      const response = await lastValueFrom(this.httpService.post(url, dto, this.kycConfig.requestConfig()))
        .then((response) => {
          try {
            const fetchedData: GetFormUrlResponse = response.data
            this.usersService.updateUser({
              userWalletAddress: dto.external_applicant_id,
              KYC_verification_id: fetchedData.verification_id,
              KYC_status: 'unused',
              KYC_verified: false,
            })

            return { form_url: fetchedData.form_url }
          } catch (error) {
            throw new BadRequestException(error.message)
          }
        })
        .catch((error) => {
          throw new HttpException(error.response.data, error.response.status)
        })

      return response
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getVerification(verification_id: string, dto: GetVerification) {
    try {
      const url = `https://api.kycaid.com/verifications/${verification_id}`
      const response = await lastValueFrom(this.httpService.get(url, this.kycConfig.requestConfig()))
        .then((response) => {
          try {
            const fetchedData: GetVerificationResponse = response.data
            this.usersService.updateUser({
              userWalletAddress: dto.userWalletAddress,
              KYC_status: fetchedData.status,
              KYC_verified: fetchedData.verified,
              KYC_verifications: fetchedData.verifications,
            })

            return fetchedData
          } catch (error) {
            throw new BadRequestException(error.message)
          }
        })
        .catch((error) => {
          throw new HttpException(error.response.data, error.response.status)
        })

      return response
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getApplicant(applicant_id: string) {
    const fetchedUser = await this.usersService.getUserByWalletAddress(applicant_id)

    return {
      applicant: fetchedUser.KYC_aplicant,
      verification_id: fetchedUser.KYC_request_id,
      verifications: fetchedUser.KYC_verifications,
      verified: fetchedUser.KYC_verified,
      status: fetchedUser.KYC_status,
      type: fetchedUser.KYC_type,
    }
  }

  async processCallback(dto: KYCCallback) {
    try {
      this.usersService.updateUser({
        KYC_verification_id: dto.verification_id,
        KYC_type: dto.type,
        KYC_status: dto.status,
        KYC_verified: dto.verified,
        KYC_verifications: dto.verifications,
        KYC_aplicant: dto.aplicant,
      })

      return dto
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
