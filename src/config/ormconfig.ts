import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

@Injectable()
export class dbConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mongodb',
      url: this.configService.get<string>('server.dbConnectionString'),
      logging: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      synchronize: true,
      entities: ['dist/users/entities/*.entity.js'],
    }
  }
}
