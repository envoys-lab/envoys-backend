import { Body, Controller, Get, HttpException, Param, Post, Query } from '@nestjs/common'
import { GetFormUrl, KYCAidCallback } from 'src/kycaid/dto/kycaid.dto'
import { KYCService } from './kyc.service'

@Controller('kyc')
export class KYCController {
  constructor(private readonly kycService: KYCService) {}

  @Get('forms/:userWalletAddress')
  async getFormUrl(@Query('type') userType: UserType, @Body() dto: GetFormUrl) {
    if (userType) {
      return this.kycService.getFormUrl(userType, dto)
    } else {
      throw new HttpException('Specify user type', 406)
    }
  }

  @Get('status/:userWalletAddress')
  async getVerification(@Param('userWalletAddress') userWalletAddress: string) {
    return this.kycService.getVerification(userWalletAddress)
  }

  @Post('callback')
  async processCallback(@Body() dto: KYCAidCallback) {
    return this.kycService.callbackHandler(dto)
  }
}

enum UserType {
  COMPANY = 'COMPANY',
  PERSON = 'PERSON',
}
