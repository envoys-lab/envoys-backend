import { registerAs } from '@nestjs/config'

const server = registerAs('server', () => ({
  port: parseInt(process.env.SERVER_PORT) || 8080,
}))

const http = registerAs('http', () => ({
  timeout: parseInt(process.env.HTTP_TIMEOUT) || 5000,
}))

const database = registerAs('database', () => ({
  connectionString: process.env.DB_CONNECTION_STRING,
}))

const kyc = registerAs('kyc', () => ({
  token: process.env.KYC_TOKEN,
  personFormId: process.env.KYC_FORM_ID_PERSON,
  companyFormId: process.env.KYC_FORM_ID_COMPANY,
}))

export default [server, http, database, kyc]
