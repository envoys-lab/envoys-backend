import { Injectable } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import { User } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserByWalletAddress(userWalletAddress: string): Promise<User> {
    return this.usersRepository.findOne({ userWalletAddress })
  }

  async createUser(userWalletAddress: string): Promise<User> {
    return this.usersRepository.create({
      userWalletAddress: userWalletAddress,
    })
  }
}
