import { IsNotEmpty, Validate } from 'class-validator'
import { IsWalletAddress } from 'src/user/validation/IsWalletAddress'

export class CreateFormUrl {
  @Validate(IsWalletAddress)
  @IsNotEmpty()
  external_applicant_id: string

  redirect_url?: string
}

export interface CreateFormUrlResponse {
  form_id: string
  form_url: string
  verification_id: string
}

export interface GetVerificationResponse {
  verification_id: string
  status: VerificationStatus
  applicant_id?: string
  verified?: boolean
  verifications?: VerificationItem
}

export enum VerificationStatus {
  UNUSED = 'unused',
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export interface VerificationItem {
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

export interface VerificationResult {
  verified: boolean
  comment: string
  decline_reasons?: string[]
}

export interface Verification extends GetVerificationResponse {
  request_id: string
  type: string
}
