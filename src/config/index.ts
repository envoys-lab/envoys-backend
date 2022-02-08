import { registerAs } from '@nestjs/config'

export const server = registerAs('server', () => ({
  port: parseInt(process.env.SERVER_PORT) || 8080,
}))

export const http = registerAs('http', () => ({
  timeout: parseInt(process.env.HTTP_TIMEOUT) || 5000,
}))

export const database = registerAs('database', () => ({
  connectionString: process.env.DB_CONNECTION_STRING,
}))

export const kyc = registerAs('kyc', () => ({
  token: process.env.KYC_TOKEN,
  personFormId: process.env.KYC_FORM_ID_PERSON,
  companyFormId: process.env.KYC_FORM_ID_COMPANY,
}))
