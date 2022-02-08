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

    if (dto.userType in UserType) {
      fetchedUser.userType = dto.userType
    }
    if (dto.verification.applicant_id != null) {
      fetchedUser.verification.applicant_id = dto.verification.applicant_id
    }
    if (dto.verification.request_id != null) {
      fetchedUser.verification.request_id = dto.verification.request_id
    }
    if (dto.verification.type != null) {
      fetchedUser.verification.type = dto.verification.type
    }
    if (dto.verification_id != undefined) {
      fetchedUser.verification_id = dto.verification_id
    }
    if (dto.verification.status in VerificationStatus) {
      fetchedUser.verification.status = dto.verification.status
    }
    if (dto.verification.verified != null) {
      fetchedUser.verification.verified = dto.verification.verified
    }
    if (dto.verification.verifications != null) {
      fetchedUser.verification.verifications = dto.verification.verifications
    }

    return this.usersRepository.save(fetchedUser)
  }
}

enum VerificationStatus {
  UNUSED = 'unused',
  PENDING = 'pending',
  COMPLETED = 'completed',
}

enum UserType {
  COMPANY = 'COMPANY',
  PERSON = 'PERSON',
}
