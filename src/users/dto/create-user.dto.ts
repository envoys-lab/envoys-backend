import { Validate, IsString, IsNotEmpty } from 'class-validator'
import { IsWalletAddress } from '../validation/IsWalletAddress'

export class CreateUserDto {
  @Validate(IsWalletAddress)
  @IsNotEmpty()
  @IsString()
  userWalletAddress: string
}
