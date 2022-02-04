import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosRequestConfig } from 'axios'

@Injectable()
class KYCConfig {
  constructor(private configService: ConfigService) {}

  requestConfig(): AxiosRequestConfig {
    return {
      headers: {
        Authorization: this.configService.get<string>('server.KYCToken'),
        'Content-Type': 'application/json',
      },
    }
  }
}

export default KYCConfig
