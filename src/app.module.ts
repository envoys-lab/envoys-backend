import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import * as configuration from './config'
import { dbConfigService } from './config/ormconfig'
import { KYCModule } from './kyc/kyc.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration.server, configuration.database, configuration.kyc],
    }),
    TypeOrmModule.forRootAsync({
      useClass: dbConfigService,
      inject: [dbConfigService],
    }),
    UsersModule,
    KYCModule,
  ],
  controllers: [AppController],
  providers: [AppService, dbConfigService],
})
export class AppModule {}
