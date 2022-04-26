import { VerificationStatus } from '../../src/kycaid/dto/kycaid.dto'
import { applicantId, userId, verificationId } from './user'

export const signature =
  '0xd33b3fa81b304d4584a7cf304fbdda8cbc261b16c0ea169487ac5a5743aaeaca71d22f2150438908e5ff4486d5461f6103171e40b756f176f7421602af2d3e941c'
export const message = 'Example message'
export const companyFormId = '678sdfsadas'
export const personFormId = '678sdfsfsdnc'
export const formUrl = 'same-random-form-url'
export const redirectUrl = 'some-random-redirect-url'

export const getFormUrlDto = {
  formUrl: formUrl,
}

export const verificationDto = {
  id: userId,
  verification: {
    applicant_id: applicantId,
    status: VerificationStatus.UNUSED,
    verified: false,
    verifications: {},
  },
}

export const callbackDto = {
  verification_id: verificationId,
  status: VerificationStatus.COMPLETED,
  applicant_id: applicantId,
  verified: true,
  verifications: {},
  request_id: '',
  type: 'CHECKING_COMPLETED',
  applicant: {},
}

export const createFormUrlResponse = { formUrl: formUrl }

export const refreshVerificationResponse = {
  id: userId,
  verification: {
    applicant_id: applicantId,
    status: VerificationStatus.UNUSED,
    verified: false,
    verifications: {},
  },
}

export const KYCServiceMock = {
  createFormUrl: jest.fn(),
  refreshVerification: jest.fn(),
  callbackHandler: jest.fn(),
}
