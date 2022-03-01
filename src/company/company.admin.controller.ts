import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common'
import { CompanyService } from './company.service'
import {
  AddCompanyRequest,
  ChangeCompanyVisibilityDto,
  ChangeCompanyVisibilityParams,
  DeleteCompanyParams,
  DeleteCompanyResponse,
  GetCompaniesListQuery,
  GetCompaniesListResponse,
  GetCompanyByIdParams,
  UpdateCompanyParams,
  UpdateCompanyRequest,
} from './dto/company.controller.dto'
import { Company } from './entity/company.entity'
import { CompanyTokenInterceptor } from './interceptor/company.token.interceptor'

@Controller('admin/companies')
@UseInterceptors(CompanyTokenInterceptor)
export class CompanyAdminController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getCompaniesList(@Query() query: GetCompaniesListQuery): Promise<GetCompaniesListResponse> {
    return this.companyService.getCompaniesList(query)
  }

  @Get(':companyId')
  async getCompanyById(@Param() params: GetCompanyByIdParams): Promise<Company> {
    return this.companyService.getCompanyById(params.companyId)
  }

  @Post()
  async addCompany(@Body() dto: AddCompanyRequest): Promise<Company> {
    return this.companyService.addCompany(dto)
  }

  @Put(':companyId/visibility')
  async changeCompanyVisibility(
    @Param() params: ChangeCompanyVisibilityParams,
    @Body() dto: ChangeCompanyVisibilityDto,
  ): Promise<Company> {
    return this.companyService.changeCompanyVisibility(params.companyId, dto)
  }

  @Patch(':companyId')
  async updateCompany(@Param() params: UpdateCompanyParams, @Body() dto: UpdateCompanyRequest): Promise<Company> {
    return this.companyService.updateCompany(params.companyId, dto)
  }

  @Delete(':companyId')
  async deleteCompany(@Param() params: DeleteCompanyParams): Promise<DeleteCompanyResponse> {
    return this.companyService.deleteCompany(params.companyId)
  }
}
