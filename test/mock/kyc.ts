import { VerificationStatus } from '../../src/kycaid/dto/kycaid.dto'
import { applicantId, userId, verificationId } from './user'

export const companyFormId = '678sdfsadas'
export const personFormId = '678sdfsfsdnc'

export const getFormUrlDto = {
  formUrl: 'formUrl',
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
}
