import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator'
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
}

export class RefreshVerificationParams {
  @IsMongoId()
  userId: ObjectID
}

export class GetApplicantParams {
  @IsMongoId()
  userId: ObjectID

  @IsEnum(UserType)
  userType: UserType
}
