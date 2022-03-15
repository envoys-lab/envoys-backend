import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3ModuleOptions, S3ModuleOptionsFactory } from 'nestjs-s3'

@Injectable()
export class AWSS3ConfigService implements S3ModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createS3ModuleOptions(): S3ModuleOptions {
    return {
      config: {
        accessKeyId: this.configService.get<string>('aws.accessKeyID'),
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
        region: this.configService.get<string>('aws.AWSRegion'),
      },
    }
  }
}
