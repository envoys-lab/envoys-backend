import { IsNotEmpty, Validate } from 'class-validator'
import { VerificationStatus } from 'src/users/enum/user.status.enum'
import { IsWalletAddress } from 'src/users/validation/IsWalletAddress'

export class GetFormUrl {
  applicant_id?: string

  @Validate(IsWalletAddress)
  @IsNotEmpty()
  external_applicant_id: string

  @IsNotEmpty()
  redirect_url: string
}

export class GetVerification {
  @Validate(IsWalletAddress)
  @IsNotEmpty()
  userWalletAddress: string
}

export class KYCCallback {
  request_id: string
  type: string
  verification_id: string
  applicant_id: string
  status: VerificationStatus
  verified: boolean
  verifications: object
}
