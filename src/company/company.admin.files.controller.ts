import { Controller, Post, UseInterceptors } from '@nestjs/common'
import { CompanyFilesService } from './company.admin.files.service'
import { AdminCompanyTokenInterceptor } from './interceptor/company.admin.token.interceptor'

@Controller('admin/companies')
@UseInterceptors(AdminCompanyTokenInterceptor)
export class CompanyFilesController {
  constructor(private readonly companyFilesService: CompanyFilesService) {}

  @Post(':companyId/file')
  async uploadFile() {
    return this.companyFilesService.uploadFile()
  }
}
