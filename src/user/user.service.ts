import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectID, Repository } from 'typeorm'
import User from './entity/user.entity'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async getUserById(id: ObjectID): Promise<User> {
    const fetchedUser = await this.userRepository.findOne(id)
    if (!fetchedUser) {
      throw new NotFoundException(`Unable to find the user by id: ${id}`)
    }

    return fetchedUser
  }

  async connectUser(userWalletAddress: string): Promise<User> {
    const fetchedUser = await this.getUserByWalletAddress(userWalletAddress)
    if (!fetchedUser) {
      return this.createUser(userWalletAddress)
    }

    return fetchedUser
  }

  private async getUserByWalletAddress(userWalletAddress: string): Promise<User> {
    const fetchedUser = await this.userRepository.findOne({ where: { userWalletAddress: userWalletAddress } })
    if (!fetchedUser) {
      return
    }

    return fetchedUser
  }

  async getUserByVerificationId(verificationId: string) {
    const fetchedUserPersonVerificationId = await this.userRepository.findOne({
      where: { 'company.verificationId': verificationId },
    })

    if (fetchedUserPersonVerificationId) {
      return fetchedUserPersonVerificationId
    }

    const fetchedUserCompanyVerificationId = await this.userRepository.findOne({
      where: { 'person.verificationId': verificationId },
    })

    if (fetchedUserCompanyVerificationId) {
      return fetchedUserCompanyVerificationId
    }

    throw new NotFoundException(`Unable to find the user by verification id: ${verificationId}`)
  }

  private async createUser(userWalletAddress: string): Promise<User> {
    const newUser: Partial<User> = this.userRepository.create({
      userWalletAddress: userWalletAddress,
      company: { verification: {} },
      person: { verification: {} },
    })

    return this.userRepository.save(newUser)
  }

  async updateUser(dto: Partial<User>) {
    let fetchedUser

    if (dto._id) {
      fetchedUser = await this.getUserById(dto._id)
    } else if (dto.userWalletAddress) {
      fetchedUser = await this.getUserByWalletAddress(dto.userWalletAddress)
    } else if (dto.person.verificationId != null) {
      fetchedUser = await this.getUserByVerificationId(dto.person.verificationId)
    } else if (dto.company.verificationId != null) {
      fetchedUser = await this.getUserByVerificationId(dto.company.verificationId)
    }

    fetchedUser = {
      ...fetchedUser,
      person: {
        ...fetchedUser.person,
        ...dto.person,
      },
      company: {
        ...fetchedUser.company,
        ...dto.company,
      },
    }

    return this.userRepository.save(fetchedUser)
  }
}
