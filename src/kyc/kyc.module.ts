import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { KYCAidModule } from 'src/kycaid/kycaid.module'
import { KYCController } from './kyc.controller'

@Module({
  imports: [HttpModule, KYCAidModule],
  controllers: [KYCController],
})
export class KYCModule {}
