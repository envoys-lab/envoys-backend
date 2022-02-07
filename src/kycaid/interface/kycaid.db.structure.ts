import { VerificationStatus } from 'src/kycaid/enum/user.enum'

export interface KYCAidVerification {
  request_id: string
  applicant_id: string
  verified: boolean
  status: VerificationStatus
  type: string
  verifications: object
}
