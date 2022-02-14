import { ObjectID } from 'mongodb'
import User from 'src/user/entity/user.entity'

export const userWalletAddress = '0x484D3D5Bbc8114B794767AeabDeCf7887FDd04C2'
export const verificationId = '17efc59c0018b2460f0b6e14f8a13c1c0fb8'
export const userId = new ObjectID('6205840eae89880012c0ad47')

export const userRecord = {
  _id: userId,
  userWalletAddress: userWalletAddress,
  verification: {},
}

export const mockUserService = {
  getUserById: jest.fn((id) =>
    Promise.resolve({
      ...userRecord,
      _id: id,
    }),
  ),
  connectUser: jest.fn((userWalletAddress) =>
    Promise.resolve({
      ...userRecord,
      userWalletAddress: userWalletAddress,
    }),
  ),
}

export const mockRepository = {
  findOne: jest.fn((query) =>
    Promise.resolve({
      ...userRecord,
    }),
  ),
  save: jest.fn((newUser: Partial<User>) => Promise.resolve({ ...newUser })),
}
