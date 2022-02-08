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

enum VerificationStatus {
  UNUSED = 'unused',
  PENDING = 'pending',
  COMPLETED = 'completed',
}
