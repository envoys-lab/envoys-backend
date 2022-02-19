import { Test, TestingModule } from '@nestjs/testing'
import { userMock, userId, userWalletAddress, UserServiceMock } from '../../test/mock/user'
import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('UserController', () => {
  let controller: UserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: UserServiceMock }],
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('/GET :id', () => {
    it('should find and return user record', () => {
      const params = { id: userId }
      const getUserByIdDto = {
        ...userMock,
        _id: userId,
      }

      jest.spyOn(UserServiceMock, 'getUserById').mockResolvedValue(getUserByIdDto)
      const getUserById = controller.getUserById(params)

      expect(getUserById).resolves.toEqual(userMock)
      expect(UserServiceMock.getUserById).toHaveBeenCalledWith(params.id)
    })
  })

  describe('/POST :userWalletAddress', () => {
    it('should create user record and return it', async () => {
      const params = { userWalletAddress: userWalletAddress }
      const connectUserDto = {
        ...userMock,
        userWalletAddress: userWalletAddress,
      }

      jest.spyOn(UserServiceMock, 'connectUser').mockResolvedValue(connectUserDto)
      const connectUser = await controller.connectUser(params)

      expect(connectUser).toEqual(userMock)
      expect(UserServiceMock.connectUser).toHaveBeenCalledWith(params.userWalletAddress)
    })
  })
})
