import { Test, TestingModule } from '@nestjs/testing'
import { userRecord, mockUserService, userId, userWalletAddress } from './models/user'
import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('UserController', () => {
  let controller: UserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile()

    controller = module.get<UserController>(UserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('/GET :id', () => {
    it('should find and return user record', () => {
      const params = { id: userId }

      expect(controller.getUserById(params)).resolves.toEqual(userRecord)
      expect(mockUserService.getUserById).toHaveBeenCalled()
    })
  })

  describe('/POST :userWalletAddress', () => {
    it('should create user record and return it', async () => {
      const params = { userWalletAddress: userWalletAddress }

      expect(await controller.connectUser(params)).toEqual(userRecord)
      expect(mockUserService.connectUser).toHaveBeenCalled()
    })
  })
})
