import { HttpModule, HttpService } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { AxiosResponse } from 'axios'
import { VerificationStatus } from './dto/kycaid.dto'
import { of } from 'rxjs'
import {
  axiosResponseModel,
  createFormUrlResponse,
  formId,
  formUrl,
  getApplicantResponse,
  getVerificationResponse,
} from '../../test/mock/kycaid'
import { userId, verificationId } from '../../test/mock/user'
import { KYCAidService } from './kycaid.service'

describe('KYCAidService', () => {
  let service: KYCAidService
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [KYCAidService],
    }).compile()

    service = module.get<KYCAidService>(KYCAidService)
    httpService = module.get<HttpService>(HttpService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createFormUrl', () => {
    it('should request and return formUrl', async () => {
      const dto = { external_applicant_id: userId }
      const response: AxiosResponse<any> = {
        ...axiosResponseModel,
        data: {
          form_id: formId,
          form_url: formUrl,
          verification_id: verificationId,
        },
      }

      jest.spyOn(httpService, 'post').mockImplementationOnce(() => of(response))

      expect(await service.createFormUrl(formId, dto)).toEqual(createFormUrlResponse)
    })
  })

  describe('getApplicant', () => {
    it('should get applicant and return that', async () => {
      const response: AxiosResponse<any> = {
        ...axiosResponseModel,
        data: {
          first_name: 'Joe',
          last_name: 'Doe',
          residence_country: 'UA',
        },
      }

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response))

      expect(await service.getVerification(verificationId)).toEqual(getApplicantResponse)
    })
  })

  describe('getVerification', () => {
    it('should update verification and return that', async () => {
      const response: AxiosResponse<any> = {
        data: {
          verification_id: verificationId,
          status: VerificationStatus.UNUSED,
        },
        headers: {},
        config: { url: 'http://localhost:8080/users' },
        status: 200,
        statusText: 'OK',
      }

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response))

      expect(await service.getVerification(verificationId)).toEqual(getVerificationResponse)
    })
  })
})
