import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import configuration from './config'
import { TypeOrmConfigService } from './config/typeorm.config'
import { KYCModule } from './kyc/kyc.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      inject: [TypeOrmConfigService],
    }),
    UsersModule,
    KYCModule,
  ],
  providers: [TypeOrmConfigService],
})
export class AppModule {}
