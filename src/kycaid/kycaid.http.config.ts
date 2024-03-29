import { HttpModuleOptions, HttpModuleOptionsFactory, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class KYCAidHttpConfigService implements HttpModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: 'https://api.kycaid.com/',
      timeout: this.configService.get<number>('http.timeout'),
      headers: {
        Authorization: `Token ${this.configService.get<string>('kyc.token')}`,
      },
    }
  }
}
