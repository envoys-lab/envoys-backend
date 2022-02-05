import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import User from './entities/user.entity'
import { VerificationStatus } from './enum/user.status.enum'

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
    })
    return this.usersRepository.save(newUser)
  }

  async updateUser(dto: Partial<User>) {
    const fetchedUser = await this.getUserByWalletAddress(dto.userWalletAddress)

    if (dto.request_id != null) {
      fetchedUser.request_id = dto.request_id
    }
    if (dto.type != null) {
      fetchedUser.type = dto.type
    }
    if (dto.verification_id != null) {
      fetchedUser.verification_id = dto.verification_id
    }
    if (dto.status in VerificationStatus) {
      fetchedUser.status = dto.status
    }
    if (dto.verified != null) {
      fetchedUser.verified = dto.verified
    }
    if (dto.verifications != null) {
      fetchedUser.verifications = dto.verifications
    }

    return this.usersRepository.save(fetchedUser)
  }
}
