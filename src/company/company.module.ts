import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CompanyAdminController } from './company.admin.controller'
import { CompanyFilesController } from './company.files.controller'
import { CompanyFilesService } from './company.files.service'
import { CompanyService } from './company.service'
import { CompanyUserController } from './company.user.controller'
import { Company } from './entity/company.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompanyAdminController, CompanyFilesController, CompanyUserController],
  providers: [CompanyService, CompanyFilesService],
})
export class CompanyModule {}
