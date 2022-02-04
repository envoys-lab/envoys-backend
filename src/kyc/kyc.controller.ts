import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { GetFormUrl, GetVerification, KYCCallback } from './dto/kyc.dto'
import { KYCService } from './kyc.service'

@Controller('kyc')
export class KYCController {
  constructor(private readonly kycService: KYCService) {}

  @Get('forms/:form_id/urls')
  async getFormUrl(@Param('form_id') form_id: string, @Body() dto: GetFormUrl) {
    return this.kycService.getFormUrl(form_id, dto)
  }

  @Get('verifications/:verification_id')
  async getVerification(@Param('verification_id') verification_id: string, @Body() dto: GetVerification) {
    return this.kycService.getVerification(verification_id, dto)
  }

  @Get('applicants/:applicant_id')
  async getApplicant(@Param('applicant_id') applicantId: string) {
    return this.kycService.getApplicant(applicantId)
  }

  @Post('callback')
  async processCallback(@Body() dto: KYCCallback) {
    return this.kycService.processCallback(dto)
  }
}
