import { Module } from '@nestjs/common'
import { KYCAidModule } from '../kycaid/kycaid.module'
import { KYCController } from './kyc.controller'
import { KYCService } from './kyc.service'
import { UserModule } from '../user/user.module'

@Module({
  imports: [UserModule, KYCAidModule],
  controllers: [KYCController],
  providers: [KYCService],
})
export class KYCModule {}
