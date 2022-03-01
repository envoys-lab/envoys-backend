import { Controller, Post, UseInterceptors } from '@nestjs/common'
import { CompanyFilesService } from './company.files.service'
import { CompanyTokenInterceptor } from './interceptor/company.token.interceptor'

@Controller('admin/companies')
@UseInterceptors(CompanyTokenInterceptor)
export class CompanyFilesController {
  constructor(private readonly companyFilesService: CompanyFilesService) {}

  @Post(':companyId/file')
  async uploadFile() {
    return this.companyFilesService.uploadFile()
  }

  @Post(':companyId/picture')
  async uploadImage() {
    return this.companyFilesService.uploadImage()
  }
}
