import { Controller, Get, Param, Query } from '@nestjs/common'
import { CompanyService } from '../company.service'
import { GetCompaniesQuery, GetCompanyByIdParams, Pagination } from '../dto/company.controller.dto'
import { Company } from '../entity/company.entity'

@Controller('companies')
export class CompanyUserController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getCompanies(@Query() query: GetCompaniesQuery): Promise<Pagination> {
    return this.companyService.getCompanies(query.page, query.size, query.search)
  }

  @Get(':companyId')
  async getCompanyById(@Param() params: GetCompanyByIdParams): Promise<Company> {
    return this.companyService.getCompanyById(params.companyId)
  }
}
