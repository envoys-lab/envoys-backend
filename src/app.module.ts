import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import configuration from './config'
import { dbConfigService } from './config/ormconfig'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useClass: dbConfigService,
      inject: [dbConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, dbConfigService],
})
export class AppModule {}
