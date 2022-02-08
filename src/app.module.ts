import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import * as configuration from './config'
import { TypeOrmConfigService } from './config/typeorm.config'
import { KYCModule } from './kyc/kyc.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration.server, configuration.database, configuration.kyc, configuration.axios],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      inject: [TypeOrmConfigService],
    }),
    UsersModule,
    KYCModule,
  ],
  controllers: [AppController],
  providers: [AppService, TypeOrmConfigService],
})
export class AppModule {}
