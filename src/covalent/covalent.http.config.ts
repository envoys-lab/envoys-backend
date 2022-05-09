import { HttpModuleOptions, HttpModuleOptionsFactory, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class CovalentHttpConfigService implements HttpModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: 'https://api.covalenthq.com/v1/97/',
      timeout: this.configService.get<number>('http.timeout'),
      params: {
        ['page-size']: 10000,
        ['quote-currency']: 'USD',
        format: 'JSON',
        key: this.configService.get<number>('covalent.APIKey'),
      },
    }
  }
}
