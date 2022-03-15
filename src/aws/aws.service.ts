import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectS3, S3 } from 'nestjs-s3'

@Injectable()
export class AWSService {
  private readonly S3Bucket: string

  constructor(@InjectS3() private readonly s3: S3, private readonly configService: ConfigService) {
    this.S3Bucket = this.configService.get<string>('aws.S3BucketName')
  }

  async uploadFile(file: Buffer, key: string) {
    const list = await this.s3
      .upload({
        Bucket: this.S3Bucket,
        Key: `${key}`,
        Body: file,
        ContentEncoding: 'base64data',
      })
      .promise()

    return list.Location
  }
}
