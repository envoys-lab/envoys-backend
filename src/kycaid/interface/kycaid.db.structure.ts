export interface KYCAidVerification {
  request_id: string
  applicant_id: string
  verified: boolean
  status: VerificationStatus
  type: string
  verifications: {
    profile?: VerificationResult
    document?: VerificationResult
    facial?: VerificationResult
    address?: VerificationResult
    aml?: VerificationResult
    financial?: VerificationResult
    payment_method?: VerificationResult
    tax_id?: VerificationResult
    company?: VerificationResult
  }
}

interface VerificationResult {
  verified: boolean
  comment: string
}

export enum VerificationStatus {
  UNUSED = 'unused',
  PENDING = 'pending',
  COMPLETED = 'completed',
}
