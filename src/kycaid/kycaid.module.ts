import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import User from 'src/users/entities/user.entity'
import { KydAidUrlHandler } from './kyc.url.handler'
import { KYCAidDatabase } from './kycaid.repository'
import { KYCAidService } from './kycaid.service'

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([User])],
  providers: [KYCAidService, KYCAidDatabase, KydAidUrlHandler],
  exports: [KYCAidService],
})
export class KYCAidModule {}
