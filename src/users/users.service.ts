import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ethers } from 'ethers'
import { Repository } from 'typeorm'
import User from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async userHandler(userWalletAddress: string): Promise<User> {
    if (!ethers.utils.isAddress(userWalletAddress)) {
      throw new HttpException('Invalid user wallet address', 406)
    }
    const fetchedUser = await this.getUserByWalletAddress(userWalletAddress)
    if (!fetchedUser) {
      return this.createUser(userWalletAddress)
    }

    return fetchedUser
  }

  async getUserByWalletAddress(userWalletAddress: string): Promise<User> {
    const fetchedUser = await this.usersRepository.findOne({ where: { userWalletAddress: userWalletAddress } })
    if (!fetchedUser) {
      return
    }

    return fetchedUser
  }

  async createUser(userWalletAddress: string): Promise<User> {
    await this.getUserByWalletAddress(userWalletAddress)
    const newUser: Partial<User> = await this.usersRepository.create({
      userWalletAddress: userWalletAddress,
      verification: {},
    })

    return this.usersRepository.save(newUser)
  }
}
