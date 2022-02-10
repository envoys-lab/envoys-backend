import { IsMongoId, IsNotEmpty, Validate } from 'class-validator'
import { IsWalletAddress } from '../validation/IsWalletAddress'
import { ObjectID } from 'typeorm'

export class ConnectUserParams {
  @Validate(IsWalletAddress)
  @IsNotEmpty()
  userWalletAddress: string
}

export class GetUserByIdParams {
  @IsMongoId()
  id: ObjectID
}
