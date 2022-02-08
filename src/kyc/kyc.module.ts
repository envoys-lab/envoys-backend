import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { KYCAidModule } from 'src/kycaid/kycaid.module'
import User from 'src/users/entities/user.entity'
import { KYCController } from './kyc.controller'
import { KYCDatabase } from './kyc.repository'
import { KYCService } from './kyc.service'

@Module({
  imports: [TypeOrmModule.forFeature([User]), KYCAidModule],
  controllers: [KYCController],
  providers: [KYCService, KYCDatabase],
})
export class KYCModule {}
