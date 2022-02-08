import { HttpService } from '@nestjs/axios'
import { map, lastValueFrom } from 'rxjs'
import { Injectable } from '@nestjs/common'
import { GetFormUrl } from './dto/kycaid.dto'
import { GetFormUrlResponse, GetVerificationResponse } from './interface/kycaid.respond'

@Injectable()
export class KYCAidService {
  constructor(private httpService: HttpService) {}

  async getFormUrl(form_id: string, dto: GetFormUrl): Promise<GetFormUrlResponse> {
    const request = this.httpService
      .post(`forms/${form_id}/urls`, dto, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(map((response) => response.data))

    return lastValueFrom(request)
  }

  async getVerification(verification_id: string): Promise<GetVerificationResponse> {
    const request = this.httpService.get(`verifications/${verification_id}`).pipe(map((response) => response.data))

    return lastValueFrom(request)
  }
}
