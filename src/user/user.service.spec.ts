import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ObjectID } from 'mongodb'
import { User, userCompanyKey, userPersonKey } from './entity/user.entity'
import { UserService } from './user.service'
import { message, signature, userId, userMock, UserRepositoryMock, userWalletAddress, verificationId } from '../../test/mock/user'

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: getRepositoryToken(User), useValue: UserRepositoryMock }],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getUserById', () => {
    it('should return user using id', async () => {
      const user = {
        _id: userId,
        userWalletAddress: userWalletAddress,
        [userCompanyKey]: {},
        [userPersonKey]: {},
      }
      const findOneSpy = jest.spyOn(UserRepositoryMock, 'findOne').mockResolvedValue(user)

      const getUserById = await service.getUserById(userId)

      expect(findOneSpy).toHaveBeenCalledWith(userId)
      expect(getUserById).toEqual(user)
    })

    it('should throw a NotFoundException', async () => {
      const FakeUserId = 'fake' as ObjectID
      jest.spyOn(UserRepositoryMock, 'findOne').mockResolvedValue(undefined)

      await expect(service.getUserById(FakeUserId)).rejects.toThrow(NotFoundException)
    })
  })

  describe('connectUser', () => {
    it('should connect user using wallet address and return that', async () => {
      jest.spyOn(UserRepositoryMock, 'create').mockResolvedValue(userMock)
      jest.spyOn(UserRepositoryMock, 'save').mockResolvedValue(userMock)

      const connectUser = await service.connectUser(userWalletAddress, signature, message)

      expect(connectUser).toEqual(userMock)
    })
  })

  describe('getUserByVerificationId', () => {
    it('should return user using verification id', async () => {
      jest.spyOn(UserRepositoryMock, 'findOne').mockResolvedValue(userMock)

      const user = await service.getUserByVerificationId(verificationId)

      expect(user).toEqual(userMock)
    })

    it('should throw a NotFoundException', async () => {
      const fakeVerificationId = 'fake'
      jest.spyOn(UserRepositoryMock, 'findOne').mockResolvedValue(undefined)

      await expect(service.getUserByVerificationId(fakeVerificationId)).rejects.toThrow(NotFoundException)
    })
  })

  describe('updateUser', () => {
    it('should update user record and return that using id', async () => {
      const userDto = {
        _id: userId,
        ...userMock,
      }
      jest.spyOn(UserRepositoryMock, 'findOne').mockResolvedValue(userMock)
      const saveSpy = jest.spyOn(UserRepositoryMock, 'save').mockResolvedValue(userDto)

      const updateUser = await service.updateUser(userDto)

      expect(saveSpy).toHaveBeenCalledWith(userDto)
      expect(updateUser).toEqual(userDto)
    })

    it('should update user record and return that using wallet address', async () => {
      const userDto = {
        ...userMock,
        userWalletAddress: userWalletAddress,
      }
      jest.spyOn(UserRepositoryMock, 'findOne').mockResolvedValue(userMock)
      const saveSpy = jest.spyOn(UserRepositoryMock, 'save').mockResolvedValue(userDto)

      const updateUser = await service.updateUser(userDto)

      expect(saveSpy).toHaveBeenCalledWith(userDto)
      expect(updateUser).toEqual(userDto)
    })

    it('should update user record and return that using verification id', async () => {
      const userDto = {
        ...userMock,
        [userCompanyKey]: {
          verificationId: verificationId,
        },
      }
      jest.spyOn(UserRepositoryMock, 'findOne').mockResolvedValue(userMock)
      const saveSpy = jest.spyOn(UserRepositoryMock, 'save').mockResolvedValue(userDto)

      const updateUser = await service.updateUser(userDto)

      expect(saveSpy).toHaveBeenCalledWith(userDto)
      expect(updateUser).toEqual(userDto)
    })

    it('should throw a NotFoundException', async () => {
      const userDtoToFail = {
        ...userMock,
        [userCompanyKey]: {},
        [userPersonKey]: {},
      }
      jest.spyOn(UserRepositoryMock, 'findOne').mockResolvedValue(undefined)

      await expect(service.updateUser(userDtoToFail)).rejects.toThrow(NotFoundException)
    })
  })
})
