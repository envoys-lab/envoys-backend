import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CompanyAdminController } from './controller/company.admin.controller'
import { CompanyAdminFilesService } from './company.files.service'
import { CompanyService } from './company.service'
import { Company } from './entity/company.entity'
import { CompanyAdminFilesController } from './controller/company.admin.files.controller'
import { CompanyUserController } from './controller/company.user.controller'
import { AWSModule } from 'src/aws/aws.module'

@Module({
  imports: [TypeOrmModule.forFeature([Company]), AWSModule],
  controllers: [CompanyAdminController, CompanyAdminFilesController, CompanyUserController],
  providers: [CompanyService, CompanyAdminFilesService],
})
export class CompanyModule {}
