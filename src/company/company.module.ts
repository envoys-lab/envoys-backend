import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CompanyAdminController } from './controller/company.admin.controller'
import { CompanyAdminFilesService } from './company.admin.files.service'
import { CompanyService } from './company.service'
import { Company } from './entity/company.entity'
import { CompanyAdminFilesController } from './company.admin.files.controller'
import { CompanyUserController } from './controller/company.user.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompanyAdminController, CompanyAdminFilesController, CompanyUserController],
  providers: [CompanyService, CompanyAdminFilesService],
})
export class CompanyModule {}
