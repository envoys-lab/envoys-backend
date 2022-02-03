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

  async createUser(userWalletAddresss: string): Promise<User> {
    try {
      await this.getUserByWalletAddress(userWalletAddresss, true)
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    const newUser = await this.usersRepository.create({ userWalletAddress: userWalletAddresss })
    return this.usersRepository.save(newUser)
  }
}
