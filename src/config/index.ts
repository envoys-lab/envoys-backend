import { registerAs } from '@nestjs/config'

export const server = registerAs('server', () => ({
  port: parseInt(process.env.SERVER_PORT) || 8080,
}))

export const kyc = registerAs('kyc', () => ({
  token: process.env.KYC_TOKEN,
}))

export const database = registerAs('database', () => ({
  dbConnectionString: process.env.DB_CONNECTION_STRING,
}))
