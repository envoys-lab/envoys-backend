import { VerificationStatus } from '../../src/kycaid/dto/kycaid.dto'
import { AxiosResponse } from 'axios'
import { verificationId } from './user'

export const formId = 'some-random-form-id'
export const formUrl = 'http://form-url.example.com'

export const createFormUrlResponse = {
  form_id: formId,
  form_url: formUrl,
  verification_id: verificationId,
}

export const getApplicantResponse = {
  first_name: 'Joe',
  last_name: 'Doe',
  residence_country: 'UA',
}

export const getVerificationResponse = {
  verification_id: verificationId,
  status: VerificationStatus.UNUSED,
}

export const axiosResponseModel: AxiosResponse<any> = {
  data: {},
  headers: {},
  config: { url: 'http://localhost:8080/users' },
  status: 200,
  statusText: 'OK',
}
