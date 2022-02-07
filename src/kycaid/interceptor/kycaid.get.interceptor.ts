import { HttpService } from '@nestjs/axios'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable } from 'rxjs'

@Injectable()
export class KYCAidGetRequestInterceptor implements NestInterceptor {
  constructor(private httpService: HttpService, private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.httpService.axiosRef.interceptors.request.use((config) => {
      config.headers = {
        Authorization: this.configService.get<string>('kyc.token'),
      }

      return config
    })

    return next.handle()
  }
}
