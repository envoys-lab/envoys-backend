import { Injectable } from '@nestjs/common'

@Injectable()
class KYCUrlHandler {
  GetFormUrl(form_id: string): string {
    return `https://api.kycaid.com/forms/${form_id}/urls`
  }

  getVerificationUrl(verification_id: string): string {
    return `https://api.kycaid.com/verifications/${verification_id}`
  }
}

export default KYCUrlHandler
