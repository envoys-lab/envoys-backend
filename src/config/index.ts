import { registerAs } from '@nestjs/config'

const server = registerAs('server', () => ({
  port: parseInt(process.env.SERVER_PORT) || 8080,
}))

const app = registerAs('app', () => ({
  token: process.env.ADMIN_AUTH_TOKEN,
}))

const http = registerAs('http', () => ({
  timeout: parseInt(process.env.HTTP_TIMEOUT) || 5000,
}))

const database = registerAs('database', () => ({
  connectionString: process.env.DB_CONNECTION_STRING,
}))

const aws = registerAs('aws', () => ({
  accessKeyID: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  AWSRegion: process.env.AWS_REGION,
  S3BucketName: process.env.S3_BUCKET_NAME,
}))

const kyc = registerAs('kyc', () => ({
  token: process.env.KYC_TOKEN,
  personFormId: process.env.KYC_FORM_ID_PERSON,
  companyFormId: process.env.KYC_FORM_ID_COMPANY,
}))

export default [server, http, database, kyc, app, aws]
