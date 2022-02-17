import { Body, Controller, Param, Post } from '@nestjs/common'
import { KYCService } from './kyc.service'
import { CreateFormUrlBody, CreateFormUrlParams, GetApplicantParams, RefreshVerificationParams } from './dto/kyc.controller.dto'
import { Verification } from '../kycaid/dto/kycaid.dto'

@Controller('users')
export class KYCController {
  constructor(private readonly kycService: KYCService) {}

  @Post(':userId/verification/:userType/create')
  async createFormUrl(@Param() params: CreateFormUrlParams, @Body() body: CreateFormUrlBody) {
    return this.kycService.createFormUrl(params.userId, params.userType, body.redirectUrl)
  }

  @Post(':userId/verification/refresh')
  async refreshVerification(@Param() params: RefreshVerificationParams) {
    return this.kycService.refreshVerification(params.userId)
  }

  @Post(':userId/applicant/:userType')
  async getApplicant(@Param() params: GetApplicantParams) {
    return this.kycService.getApplicant(params.userId, params.userType)
  }

  @Post('verification/callback')
  async processVerificationCallback(@Body() dto: Verification) {
    return this.kycService.callbackHandler(dto)
  }
}
