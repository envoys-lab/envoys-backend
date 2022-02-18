import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { ApplicantDocuments, Verification } from '../../kycaid/dto/kycaid.dto'

@Entity({ name: 'Users' })
export default class User extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID

  @Column()
  userWalletAddress: string

  @Column()
  company: Partial<UserModel>

  @Column()
  person: Partial<UserModel>
}

export interface UserModel {
  verificationId?: string
  formUrl?: string
  verification: Partial<Verification>
  data?: Partial<ApplicantModel>
}

export interface ApplicantModel {
  first_name?: string
  middle_name?: string
  last_name?: string
  residence_country?: string
  documents?: ApplicantDocuments
  companyName?: string
  registration_country?: string
  business_activity?: object
}

export enum UserType {
  COMPANY = 'COMPANY',
  PERSON = 'PERSON',
}
