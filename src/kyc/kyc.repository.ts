import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import User from 'src/users/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class KYCDatabase {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async getUserByUserWalletAddress(userWalletAddress: string) {
    const fetchedUser = await this.usersRepository.findOne({ where: { userWalletAddress: userWalletAddress } })
    if (!fetchedUser) {
      throw new NotFoundException('Unable to find the user')
    }

    return fetchedUser
  }

  async getUserByVerificationId(verification_id: string) {
    const fetchedUser = await this.usersRepository.findOne({ where: { verification_id: verification_id } })
    if (!fetchedUser) {
      throw new NotFoundException('Unable to find the user')
    }

    return fetchedUser
  }

  async updateUser(dto: Partial<User>) {
    let fetchedUser
    if (dto.userWalletAddress) {
      fetchedUser = await this.getUserByUserWalletAddress(dto.userWalletAddress)
    } else {
      fetchedUser = await this.getUserByVerificationId(dto.verification_id)
    }

    fetchedUser = {
      ...fetchedUser,
      ...dto,
    }

    return this.usersRepository.save(fetchedUser)
  }
}
