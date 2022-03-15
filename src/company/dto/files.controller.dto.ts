import { IsMongoId } from 'class-validator'
import { ObjectID } from 'typeorm'

export class UploadFileParams {
  @IsMongoId()
  companyId: ObjectID
}
