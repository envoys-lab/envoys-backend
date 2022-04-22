import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './entity/user.entity'
import { ConnectUserBody, ConnectUserParams, GetUserByIdParams } from './dto/user.controller.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param() params: GetUserByIdParams): Promise<Partial<User>> {
    return this.userService.getUserById(params.id)
  }

  @Post(':userWalletAddress')
  async connectUser(@Param() params: ConnectUserParams, @Body() body: ConnectUserBody): Promise<User> {
    return this.userService.connectUser(params.userWalletAddress, body.signature, body.message)
  }
}
