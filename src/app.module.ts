import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import configuration from './config'
import { TypeOrmConfigService } from './config/typeorm.config'
import { KYCModule } from './kyc/kyc.module'
import { DatabaseModule } from './database.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
    }),
    DatabaseModule,
    UsersModule,
    KYCModule,
  ],
  providers: [TypeOrmConfigService],
})
export class AppModule {}
