import { VerificationStatus } from 'src/users/enum/user.status.enum'

export interface GetFormUrlResponse {
  form_id: string
  form_url: string
  verification_id: string
}

export interface GetVerificationResponse {
  applicant_id: string
  verification_id: string
  status: VerificationStatus
  verified: boolean
  verifications: object
}
