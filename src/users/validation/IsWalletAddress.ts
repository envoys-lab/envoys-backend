import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { ethers } from 'ethers'

@ValidatorConstraint({ name: 'IsWalletAddress' })
export class IsWalletAddress implements ValidatorConstraintInterface {
  validate(walletAddress: string): boolean | Promise<boolean> {
    if (ethers.utils.isAddress(walletAddress)) {
      return true
    }
    return false
  }

  defaultMessage(): string {
    return 'Invalid user wallet address'
  }
}
