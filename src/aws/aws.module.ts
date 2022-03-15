import { Module } from '@nestjs/common'
import { S3Module } from 'nestjs-s3'
import { AWSS3ConfigService } from './aws.s3.config'
import { AWSService } from './aws.service'

@Module({
  imports: [S3Module.forRootAsync({ useClass: AWSS3ConfigService })],
  providers: [AWSService],
  exports: [AWSService],
})
export class AWSModule {}
