import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import User from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async getUserByWalletAddress(userWalletAddress: string, ifExistCheck = false): Promise<User> {
    const fetchedUser = await this.usersRepository.findOne({ where: { userWalletAddress: userWalletAddress } })
    if (!fetchedUser && !ifExistCheck) {
      throw new NotFoundException('There is no user with such wallet address')
    }
    if (fetchedUser && ifExistCheck) {
      throw new BadRequestException('Wallet address is already registered')
    }

    return fetchedUser
  }

  async createUser(userWalletAddress: string): Promise<User> {
    try {
      await this.getUserByWalletAddress(userWalletAddress, true)
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    const newUser: Partial<User> = await this.usersRepository.create({
      userWalletAddress: userWalletAddress,
      verification: {},
    })
    return this.usersRepository.save(newUser)
  }
}
