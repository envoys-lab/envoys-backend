export class GetFormUrl {
  applicant_id?: string
  external_applicant_id: string
  redirect_url: string
}

export class GetVerification {
  userWalletAddress: string
}

export class KYCCallback {
  request_id: string
  type: string
  verification_id: string
  applicant_id: string
  status: 'unused' | 'pending' | 'completed'
  verified: boolean
  verifications: object
  aplicant: object
}
