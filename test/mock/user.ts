import { ObjectID } from 'mongodb'
import { UserType } from '../../src/user/entity/user.entity'

export const userWalletAddress = '0x0D3dE49668C749f6C5C2E97Eb3C511118bDCEF53'
export const verificationId = '17efc59c0018c2360e0b6e14f8a13c1c0fb8'
export const applicantId = '92b57052056042486d0b81f47402cb0974ab'
export const userId = new ObjectID('6205840eae89880012c0ad47')
export const userType = UserType.PERSON

export const userMock = {
  _id: userId,
  userWalletAddress: userWalletAddress,
  company: {},
  person: {},
}

export const UserServiceMock = {
  getUserById: jest.fn(),
  connectUser: jest.fn(),
  getUserByVerificationId: jest.fn(),
}

export const UserRepositoryMock = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
}
