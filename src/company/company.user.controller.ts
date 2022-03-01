import { Controller, Get, Param, Query } from '@nestjs/common'
import { CompanyService } from './company.service'
import { GetCompaniesListQuery, GetCompanyByIdParams } from './dto/company.controller.dto'

@Controller('companies')
export class CompanyUserController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getCompaniesList(@Query() query: GetCompaniesListQuery) {
    return this.companyService.getCompaniesList(query)
  }

  @Get(':companyId')
  async getCompanyById(@Param() params: GetCompanyByIdParams) {
    return this.companyService.getCompanyById(params.companyId)
  }
}
