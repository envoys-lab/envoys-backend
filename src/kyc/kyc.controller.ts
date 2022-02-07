import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common'
import { GetFormUrl, KYCAidCallback } from 'src/kycaid/dto/kycaid.dto'
import { KYCAidGetRequestInterceptor } from 'src/kycaid/interceptor/kycaid.get.interceptor'
import { KYCAidPostRequestInterceptor } from 'src/kycaid/interceptor/kycaid.post.interceptor'
import { KYCAidService } from 'src/kycaid/kycaid.service'
import { UserType } from 'src/kycaid/enum/user.enum'

@Controller('kyc')
export class KYCController {
  constructor(private readonly kycAidService: KYCAidService) {}

  @Get('new/:userWalletAddress')
  @UseInterceptors(KYCAidPostRequestInterceptor)
  async getFormUrl(@Query('type') userType: UserType, @Body() dto: GetFormUrl) {
    return this.kycAidService.getFormUrl(userType, dto)
  }

  @Get('status/:userWalletAddress')
  @UseInterceptors(KYCAidGetRequestInterceptor)
  async getVerification(@Param('userWalletAddress') userWalletAddress: string) {
    return this.kycAidService.getVerification(userWalletAddress)
  }

  @Post('callback')
  async processCallback(@Body() dto: KYCAidCallback) {
    return this.kycAidService.processCallback(dto)
  }
}
