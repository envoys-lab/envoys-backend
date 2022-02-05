import { HttpService } from '@nestjs/axios'
import { Injectable, HttpException, BadRequestException } from '@nestjs/common'
import KYCUrlHandler from 'src/config/kycurlconfig'
import { VerificationStatus } from 'src/users/enum/user.status.enum'
import { UsersService } from 'src/users/users.service'
import { GetFormUrl, GetVerification, KYCCallback } from './dto/kyc.dto'
import { GetFormUrlResponse, GetVerificationResponse } from './interface/kyc.respond'

@Injectable()
export class KYCService {
  constructor(private httpService: HttpService, private readonly usersService: UsersService, private kycUrls: KYCUrlHandler) {}

  async getFormUrl(form_id: string, dto: GetFormUrl) {
    const response = await this.httpService.axiosRef
      .post(this.kycUrls.GetFormUrl(form_id), dto)
      .then((response) => {
        const fetchedData: GetFormUrlResponse = response.data
        this.usersService.updateUser({
          userWalletAddress: dto.external_applicant_id,
          verification_id: fetchedData.verification_id,
          status: VerificationStatus.unused,
          verified: false,
        })

        return { form_url: fetchedData.form_url }
      })
      .catch((error) => {
        throw new HttpException(error.response.data, error.response.status)
      })

    // const response = await lastValueFrom(this.httpService.post(url, dto))
    //   .then((response) => {
    //     const fetchedData: GetFormUrlResponse = response.data
    //     this.usersService.updateUser({
    //       userWalletAddress: dto.external_applicant_id,
    //       verification_id: fetchedData.verification_id,
    //       status: 'unused',
    //       verified: false,
    //     })

    //     return { form_url: fetchedData.form_url }
    //   })
    //   .catch((error) => {
    //     throw new HttpException(error.response.data, error.response.status)
    //   })

    return response
  }

  async getVerification(verification_id: string, dto: GetVerification) {
    const response = await this.httpService.axiosRef
      .get(this.kycUrls.getVerificationUrl(verification_id))
      .then((response) => {
        const fetchedData: GetVerificationResponse = response.data
        this.usersService.updateUser({
          userWalletAddress: dto.userWalletAddress,
          status: fetchedData.status,
          verified: fetchedData.verified,
          verifications: fetchedData.verifications,
        })

        return fetchedData
      })
      .catch((error) => {
        throw new HttpException(error.response.data, error.response.status)
      })

    return response
  }

  async getApplicant(applicant_id: string) {
    const fetchedUser = await this.usersService.getUserByWalletAddress(applicant_id)

    return {
      verification_id: fetchedUser.request_id,
      verifications: fetchedUser.verifications,
      verified: fetchedUser.verified,
      status: fetchedUser.status,
      type: fetchedUser.type,
    }
  }

  async processCallback(dto: KYCCallback) {
    try {
      this.usersService.updateUser({
        verification_id: dto.verification_id,
        type: dto.type,
        status: dto.status,
        verified: dto.verified,
        verifications: dto.verifications,
      })

      return dto
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
