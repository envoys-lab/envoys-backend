import { registerAs } from '@nestjs/config'

export default registerAs('server', () => ({
  port: parseInt(process.env.SERVER_PORT) || 8080,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
}))
