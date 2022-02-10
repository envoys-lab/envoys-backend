import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mongodb',
      url: this.configService.get<string>('database.connectionString'),
      logging: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      synchronize: false,
      entities: ['dist/**/*.entity{ .ts,.js}'],
    }
  }
}
