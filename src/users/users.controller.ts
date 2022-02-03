import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import User from './entities/user.entity'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userWalletAddress')
  async getUser(@Param('userWalletAddress') userWalletAddress: string): Promise<User> {
    return this.usersService.getUserByWalletAddress(userWalletAddress)
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto.userWalletAddress)
  }
}
