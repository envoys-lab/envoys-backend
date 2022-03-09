import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable } from 'rxjs'

@Injectable()
export class AdminCompanyTokenInterceptor implements NestInterceptor {
  private readonly token: string

  constructor(private configService: ConfigService) {
    this.token = `Token ${this.configService.get<string>('app.token')}`
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const tokenKey: string = context.switchToHttp().getRequest().headers.authorization

    if (!this.isTokenValid(tokenKey)) {
      throw new ForbiddenException('Forbidden resource: Invalid token')
    }

    return next.handle()
  }

  private isTokenValid(tokenKey: string) {
    return tokenKey && tokenKey === this.token
  }
}
