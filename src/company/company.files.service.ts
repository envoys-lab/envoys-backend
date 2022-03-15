import { BadRequestException, Injectable } from '@nestjs/common'
import { ObjectID } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { AWSService } from '../aws/aws.service'
import { CompanyService } from './company.service'

@Injectable()
export class CompanyAdminFilesService {
  constructor(private readonly companyService: CompanyService, private readonly awsService: AWSService) {}

  async uploadFile(companyId: ObjectID, file: Buffer, name: string) {
    if (!file || !name) {
      throw new BadRequestException('No file attached!')
    }

    await this.companyService.getCompanyById(companyId)

    const newName = this.generateFilePath(companyId, name)

    return this.awsService.uploadFile(file, newName)
  }

  private generateFilePath(companyId: ObjectID, originalName: string) {
    const fileExtension = originalName.slice(originalName.lastIndexOf('.'))
    const awsFileId = uuidv4()

    return fileExtension ? `companies/${companyId}/${awsFileId}${fileExtension}` : null
  }
}
