import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import configuration from './config'
import { KYCModule } from './kyc/kyc.module'
import { DatabaseModule } from './database.module'
import { CompanyModule } from './company/company.module'
import { CovalentModule } from './covalent/covalent.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
    }),
    DatabaseModule,
    UserModule,
    KYCModule,
    CompanyModule,
    CovalentModule,
  ],
})
export class AppModule {}
