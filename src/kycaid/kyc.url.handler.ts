import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserType } from 'src/kycaid/enum/user.enum'

@Injectable()
export class KydAidUrlHandler {
  constructor(private configService: ConfigService) {}

  getFormUrl(userType: UserType): string {
    if (userType == UserType.PERSON) {
      return `https://api.kycaid.com/forms/${this.configService.get<string>('kyc.personFormId')}/urls`
    }
    if (userType == UserType.COMPANY) {
      return `https://api.kycaid.com/forms/${this.configService.get<string>('kyc.companyFormId')}/urls`
    }
  }

  getVerificationUrl(userWalletAddress: string): string {
    return `https://api.kycaid.com/verifications/${userWalletAddress}`
  }
}
