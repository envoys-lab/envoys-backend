import { Test, TestingModule } from '@nestjs/testing'
import { applicantId, userId, verificationId } from '../user/models/user'
import { UserType } from '../user/entity/user.entity'
import { KYCController } from './kyc.controller'
import { KYCService } from './kyc.service'
import { VerificationStatus } from '../kycaid/dto/kycaid.dto'
import { callbackDto, getFormUrlDto, verificationDto } from './models/kyc'

describe('KYCController', () => {
  let controller: KYCController

  const mockKYCService = {
    createFormUrl: jest.fn(() => Promise.resolve({ formUrl: 'formUrl' })),
    refreshVerification: jest.fn(() =>
      Promise.resolve({
        id: userId,
        verification: {
          applicant_id: applicantId,
          status: VerificationStatus.UNUSED,
          verified: false,
          verifications: {},
        },
      }),
    ),
    callbackHandler: jest.fn((dto) => Promise.resolve({ ...dto })),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KYCController],
      providers: [{ provide: KYCService, useValue: mockKYCService }],
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
        redirectUrl: 'http://localhost',
      }

      expect(await controller.createFormUrl(params, body)).toEqual(getFormUrlDto)
      expect(mockKYCService.createFormUrl).toHaveBeenCalled()
    })
  })

  describe('/POST :userId/verification/refresh', () => {
    it('should update verification and return that', async () => {
      expect(await controller.refreshVerification(userId)).toEqual(verificationDto)
      expect(mockKYCService.refreshVerification).toHaveBeenCalled()
    })
  })

  describe('/POST verification/callback', () => {
    it('should process callback', async () => {
      const dto = {
        verification_id: verificationId,
        status: VerificationStatus.COMPLETED,
        applicant_id: applicantId,
        verified: true,
        verifications: {},
        request_id: '',
        type: 'CHECKING_COMPLETED',
      }

      expect(await controller.processVerificationCallback(dto)).toEqual(callbackDto)
      expect(mockKYCService.callbackHandler).toHaveBeenCalled()
    })
  })
})
