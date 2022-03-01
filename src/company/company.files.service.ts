import { Injectable } from '@nestjs/common'

@Injectable()
export class CompanyFilesService {
  async uploadFile() {
    return 'uploadFile'
  }

  async uploadImage() {
    return 'uploadImage'
  }
}
