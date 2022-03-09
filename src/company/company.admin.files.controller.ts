import { Controller, Post, UseInterceptors } from '@nestjs/common'
import { CompanyAdminFilesService } from './company.admin.files.service'
import { AdminCompanyTokenInterceptor } from './interceptor/company.admin.token.interceptor'

@Controller('admin/companies')
@UseInterceptors(AdminCompanyTokenInterceptor)
export class CompanyAdminFilesController {
  constructor(private readonly companyFilesService: CompanyAdminFilesService) {}

  @Post(':companyId/file')
  async uploadFile() {
    return this.companyFilesService.uploadFile()
  }
}
