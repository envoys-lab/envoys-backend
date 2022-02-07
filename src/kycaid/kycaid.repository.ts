import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import User from 'src/users/entities/user.entity'
import { UserType, VerificationStatus } from 'src/kycaid/enum/user.enum'
import { Repository } from 'typeorm'

@Injectable()
export class KYCAidDatabase {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async getUser(userWalletAddress?: string, verification_id?: string) {
    let query = {}
    if (userWalletAddress) {
      query = { where: { userWalletAddress: userWalletAddress } }
    }
    if (verification_id) {
      query = { where: { verification_id: verification_id } }
    }

    const fetchedUser = await this.usersRepository.findOne(query)
    if (!fetchedUser) {
      throw new NotFoundException('Unable to find the user')
    }

    return fetchedUser
  }

  async updateUser(dto: Partial<User>, userWalletAddress: string) {
    const fetchedUser = await this.getUser(userWalletAddress, null)

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
