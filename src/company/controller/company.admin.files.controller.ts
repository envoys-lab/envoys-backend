import { Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CompanyAdminFilesService } from '../company.files.service'
import { UploadFileParams } from '../dto/files.controller.dto'
import { AdminCompanyTokenInterceptor } from '../interceptor/company.admin.token.interceptor'
import { multerOptions } from '../multer/multer.options'

@Controller('admin/companies')
@UseInterceptors(AdminCompanyTokenInterceptor)
export class CompanyAdminFilesController {
  constructor(private readonly companyFilesService: CompanyAdminFilesService) {}

  @Post(':companyId/file')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(@Param() params: UploadFileParams, @UploadedFile() file: Express.Multer.File) {
    return this.companyFilesService.uploadFile(params.companyId, file?.buffer, file?.originalname)
  }
}
