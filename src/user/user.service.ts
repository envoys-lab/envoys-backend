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
    const fetchedUser = await this.userRepository.findOne({ where: { verificationId: verificationId } })
    if (!fetchedUser) {
      throw new NotFoundException(`Unable to find the user by verification id: ${verificationId}`)
    }

    return fetchedUser
  }

  private async createUser(userWalletAddress: string): Promise<User> {
    const newUser: Partial<User> = this.userRepository.create({
      userWalletAddress: userWalletAddress,
      verification: {},
    })

    return this.userRepository.save(newUser)
  }

  async updateUser(dto: Partial<User>) {
    let fetchedUser

    if (dto._id) {
      fetchedUser = await this.getUserById(dto._id)
    } else if (dto.userWalletAddress) {
      fetchedUser = await this.getUserByWalletAddress(dto.userWalletAddress)
    } else {
      fetchedUser = await this.getUserByVerificationId(dto.verificationId)
    }

    fetchedUser = {
      ...fetchedUser,
      ...dto,
    }

    return this.userRepository.save(fetchedUser)
  }
}
