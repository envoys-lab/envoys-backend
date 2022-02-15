import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectID, Repository } from 'typeorm'
import User, { UserType } from './entity/user.entity'

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
    const fetchedUserCompanyVerificationId = await this.userRepository.findOne({
      where: { companyVerificationId: verificationId },
    })
    const fetchedUserPersonVerificationId = await this.userRepository.findOne({
      where: { personVerificationId: verificationId },
    })

    if (!fetchedUserCompanyVerificationId && !fetchedUserPersonVerificationId) {
      throw new NotFoundException(`Unable to find the user by verification id: ${verificationId}`)
    }

    return fetchedUserPersonVerificationId ? fetchedUserPersonVerificationId : fetchedUserCompanyVerificationId
  }

  private async createUser(userWalletAddress: string): Promise<User> {
    const newUser: Partial<User> = this.userRepository.create({
      userWalletAddress: userWalletAddress,
      companyVerification: {},
      personVerification: {},
    })

    return this.userRepository.save(newUser)
  }

  async updateUser(dto: Partial<User>) {
    let fetchedUser

    if (dto._id) {
      fetchedUser = await this.getUserById(dto._id)
    } else if (dto.userWalletAddress) {
      fetchedUser = await this.getUserByWalletAddress(dto.userWalletAddress)
    } else if (dto.companyVerificationId) {
      fetchedUser = await this.getUserByVerificationId(dto.companyVerificationId)
    } else {
      fetchedUser = await this.getUserByVerificationId(dto.personVerificationId)
    }

    fetchedUser = {
      ...fetchedUser,
      ...dto,
    }

    return this.userRepository.save(fetchedUser)
  }
}
