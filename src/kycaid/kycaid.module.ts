import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { KYCAidService } from './kycaid.service'
import { KYCAidHttpConfigService } from './kycaid.http.config'

@Module({
  imports: [HttpModule.registerAsync({ useClass: KYCAidHttpConfigService })],
  providers: [KYCAidService],
  exports: [KYCAidService],
})
export class KYCAidModule {}
