import { IsNotEmpty, Validate } from 'class-validator'
import { VerificationStatus } from 'src/kycaid/enum/user.enum'
import { IsWalletAddress } from 'src/users/validation/IsWalletAddress'

export class GetFormUrl {
  @Validate(IsWalletAddress)
  @IsNotEmpty()
  external_applicant_id: string

  @IsNotEmpty()
  redirect_url: string
}

export class KYCAidCallback {
  request_id: string
  type: string
  verification_id: string
  applicant_id: string
  status: VerificationStatus
  verified: boolean
  verifications: object
}
