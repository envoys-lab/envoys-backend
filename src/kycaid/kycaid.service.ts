import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { GetFormUrl } from './dto/kycaid.dto'
import { GetFormUrlResponse, GetVerificationResponse } from './interface/kycaid.respond'

@Injectable()
export class KYCAidService {
  constructor(private httpService: HttpService) {}

  async getFormUrl(form_id: string, dto: GetFormUrl): Promise<GetFormUrlResponse> {
    const response = await this.httpService.axiosRef.post(`forms/${form_id}/urls`, dto, {
      headers: { 'Content-Type': 'application/json' },
    })

    return response.data
  }

  async getVerification(verification_id: string): Promise<GetVerificationResponse> {
    const response = await this.httpService.axiosRef.get(`verifications/${verification_id}`)

    return response.data
  }
}
