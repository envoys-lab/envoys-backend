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
    })
    return this.usersRepository.save(newUser)
  }

  async updateUser(dto: Partial<User>) {
    const fetchedUser = await this.getUserByWalletAddress(dto.userWalletAddress)

    if (dto.KYC_request_id != null) {
      fetchedUser.KYC_request_id = dto.KYC_request_id
    }
    if (dto.KYC_type != null) {
      fetchedUser.KYC_type = dto.KYC_type
    }
    if (dto.KYC_verification_id != null) {
      fetchedUser.KYC_verification_id = dto.KYC_verification_id
    }
    if (dto.KYC_status != null) {
      fetchedUser.KYC_status = dto.KYC_status
    }
    if (dto.KYC_verified != null) {
      fetchedUser.KYC_verified = dto.KYC_verified
    }
    if (dto.KYC_verifications != null) {
      fetchedUser.KYC_verifications = dto.KYC_verifications
    }
    if (dto.KYC_aplicant != null) {
      fetchedUser.KYC_aplicant = dto.KYC_aplicant
    }

    return this.usersRepository.save(fetchedUser)
  }
}
