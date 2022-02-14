import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { userId, userRecord, mockRepository, verificationId, userWalletAddress } from '../models/mock/user'
import User from './entity/user.entity'
import { UserService } from './user.service'

describe('UserController', () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getUserById', () => {
    it('should return user using id', async () => {
      expect(await service.getUserById(userId)).toEqual(userRecord)
      expect(mockRepository.findOne).toHaveBeenCalledWith(userId)
    })
  })

  describe('connectUser', () => {
    it('should connect user using wallet address and return that', async () => {
      expect(await service.connectUser(userWalletAddress)).toEqual(userRecord)
    })
  })

  describe('getUserByVerificationId', () => {
    it('should return user using verification id', async () => {
      expect(await service.getUserByVerificationId(verificationId)).toEqual(userRecord)
      expect(mockRepository.findOne).toHaveBeenCalled()
    })
  })

  describe('updateUser', () => {
    it('should update user record and return that using id', async () => {
      const userDto = {
        id: userId,
        ...userRecord,
      }

      expect(await service.updateUser(userDto)).toEqual(userDto)
      expect(mockRepository.save).toHaveBeenCalledWith(userDto)
    })

    it('should update user record and return that using wallet address', async () => {
      const userDto = {
        userWalletAddress: userWalletAddress,
        ...userRecord,
      }

      expect(await service.updateUser(userDto)).toEqual(userDto)
      expect(mockRepository.save).toHaveBeenCalledWith(userDto)
    })

    it('should update user record and return that using verification id', async () => {
      const userDto = {
        verificationId: verificationId,
        ...userRecord,
      }

      expect(await service.updateUser(userDto)).toEqual(userDto)
      expect(mockRepository.save).toHaveBeenCalledWith(userDto)
    })
  })
})
