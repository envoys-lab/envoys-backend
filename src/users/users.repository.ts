import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(userFilterQuery: FilterQuery<User>, ifExistCheck = false): Promise<User> {
    const fetchedUser: User = await this.userModel.findOne(userFilterQuery)
    if (!fetchedUser) {
      throw new NotFoundException('There is no such user')
    }
    if (fetchedUser && ifExistCheck) {
      throw new BadRequestException('Wallet address is already registered')
    }

    return fetchedUser
  }

  async create(user: User): Promise<User> {
    try {
      await this.findOne({ user }, true)
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    const newUser = new this.userModel(user)
    return newUser.save()
  }
}
