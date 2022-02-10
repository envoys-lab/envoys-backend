import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import * as fs from 'fs'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return prepareConfiguration(this.configService.get<string>('database.connectionString'))
  }
}

function prepareConfiguration(connectionString: string): TypeOrmModuleOptions {
  getMigrationDir()
  return {
    type: 'mongodb',
    url: connectionString,
    logging: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  }
}

const migrationConfiguration = prepareConfiguration(process.env.DB_CONNECTION_STRING)

export const MigrationOrmConfig = {
  ...migrationConfiguration,
  migrations: [getMigrationDir()],
  cli: {
    migrationsDir: __dirname + '../migrations',
  },
}

function getMigrationDir() {
  if (fs.existsSync('src/migrations')) {
    return 'src/migrations/*.ts'
  } else {
    return 'dist/migrations/*.js'
  }
}

export default MigrationOrmConfig
