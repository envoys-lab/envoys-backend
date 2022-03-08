import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CompanyAdminController } from './company.admin.controller'
import { CompanyAdminFilesController } from './company.admin.files.controller'
import { CompanyAdminFilesService } from './company.admin.files.service'
import { CompanyService } from './company.service'
import { CompanyUserController } from './company.user.controller'
import { Company } from './entity/company.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompanyAdminController, CompanyAdminFilesController, CompanyUserController],
  providers: [CompanyService, CompanyAdminFilesService],
})
export class CompanyModule {}
