import { VerificationStatus } from 'src/kycaid/enum/user.enum'

export interface GetFormUrlResponse {
  form_id: string
  form_url: string
  verification_id: string
}

export interface GetVerificationResponse {
  applicant_id?: string
  verification_id: string
  status: VerificationStatus
  verified: boolean
  verifications: object
}
