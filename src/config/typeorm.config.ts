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
      migrationsRun: true,
      entities: ['dist/**/*.entity{ .ts,.js}'],
      migrations: ['dist/**/db/migrations/*{ .ts,.js}'],
      cli: {
        migrationsDir: 'db/migrations',
      },
    }
  }
}
