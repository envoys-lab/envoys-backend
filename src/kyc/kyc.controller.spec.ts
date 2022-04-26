import { Test, TestingModule } from '@nestjs/testing'
import { userId, userWalletAddress } from '../../test/mock/user'
import { UserType } from '../user/entity/user.entity'
import { KYCController } from './kyc.controller'
import { KYCService } from './kyc.service'
import {
  callbackDto,
  createFormUrlResponse,
  getFormUrlDto,
  KYCServiceMock,
  message,
  refreshVerificationResponse,
  signature,
  verificationDto,
} from '../../test/mock/kyc'

describe('KYCController', () => {
  let controller: KYCController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KYCController],
      providers: [{ provide: KYCService, useValue: KYCServiceMock }],
    }).compile()

    controller = module.get<KYCController>(KYCController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('/POST :userId/verification/:userType/create', () => {
    it('should request and return formUrl', async () => {
      const params = {
        userId: userId,
        userType: UserType.PERSON,
      }
      const body = {
        userWalletAddress,
        signature,
        message,
        redirectUrl: 'http://localhost',
      }
      jest.spyOn(KYCServiceMock, 'createFormUrl').mockResolvedValue(createFormUrlResponse)

      const createFormUrl = await controller.createFormUrl(params, body)

      expect(createFormUrl).toEqual(getFormUrlDto)
      expect(KYCServiceMock.createFormUrl).toHaveBeenCalled()
    })
  })

  describe('/POST :userId/verification/refresh', () => {
    it('should update verification and return that', async () => {
      jest.spyOn(KYCServiceMock, 'refreshVerification').mockResolvedValue(refreshVerificationResponse)

      const refreshVerification = await controller.refreshVerification(userId)

      expect(refreshVerification).toEqual(verificationDto)
      expect(KYCServiceMock.refreshVerification).toHaveBeenCalled()
    })
  })

  describe('/POST verification/callback', () => {
    it('should process callback', async () => {
      jest.spyOn(KYCServiceMock, 'callbackHandler').mockResolvedValue(callbackDto)

      const processVerificationCallback = await controller.processVerificationCallback(callbackDto)

      expect(processVerificationCallback).toEqual(callbackDto)
      expect(KYCServiceMock.callbackHandler).toHaveBeenCalled()
    })
  })
})
