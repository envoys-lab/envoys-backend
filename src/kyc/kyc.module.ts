import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import KYCConfig from 'src/config/kycconfig'
import { UsersModule } from 'src/users/users.module'
import { KYCController } from './kyc.controller'
import { KYCService } from './kyc.service'

@Module({
  imports: [HttpModule, UsersModule],
  controllers: [KYCController],
  providers: [KYCService, KYCConfig],
})
export class KYCModule {}
