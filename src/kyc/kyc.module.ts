import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import KYCConfig from 'src/config/kycurlconfig'
import { UsersModule } from 'src/users/users.module'
import { KYCRequestInterceptor } from './interceptor/kyc.request.interceptor'
import { KYCController } from './kyc.controller'
import { KYCService } from './kyc.service'

@Module({
  imports: [HttpModule, UsersModule],
  controllers: [KYCController],
  providers: [
    KYCService,
    KYCConfig,
    {
      provide: APP_INTERCEPTOR,
      useClass: KYCRequestInterceptor,
    },
  ],
})
export class KYCModule {}
