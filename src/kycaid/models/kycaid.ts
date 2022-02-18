import { verificationId } from '../../user/models/user'
import { VerificationStatus } from '../dto/kycaid.dto'
import { AxiosResponse } from 'axios'

export const formId = '6472g32ffys88x90cc8'
export const formUrl = 'dgfdg'

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
