import { HttpService } from '@nestjs/axios'
import { map, lastValueFrom } from 'rxjs'
import { Injectable } from '@nestjs/common'
import { CreateFormUrl, CreateFormUrlResponse, GetApplicantResponse, GetVerificationResponse } from './dto/kycaid.dto'

@Injectable()
export class KYCAidService {
  constructor(private httpService: HttpService) {}

  async createFormUrl(formId: string, dto: CreateFormUrl): Promise<CreateFormUrlResponse> {
    const request = this.httpService
      .post(`forms/${formId}/urls`, dto, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(map((response) => response.data))

    return lastValueFrom(request)
  }

  async getApplicant(applicantId: string): Promise<GetApplicantResponse> {
    const request = this.httpService.get(`applicants/${applicantId}`).pipe(map((response) => response.data))

    return lastValueFrom(request)
  }

  async getVerification(verificationId: string): Promise<GetVerificationResponse> {
    const request = this.httpService.get(`verifications/${verificationId}`).pipe(map((response) => response.data))

    return lastValueFrom(request)
  }
}
