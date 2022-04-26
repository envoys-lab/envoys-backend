import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { UserType } from '../../user/entity/user.entity'
import { ObjectID } from 'typeorm'

export class CreateFormUrlParams {
  @IsMongoId()
  userId: ObjectID

  @IsEnum(UserType)
  userType: UserType
}

export class CreateFormUrlBody {
  @IsString()
  @IsOptional()
  redirectUrl?: string

  @IsNotEmpty()
  userWalletAddress: string

  @IsNotEmpty()
  signature: string

  @IsNotEmpty()
  message: string
}

export class RefreshVerificationParams {
  @IsMongoId()
  userId: ObjectID
}

export interface FormUrlResponse {
  formUrl: string
}
