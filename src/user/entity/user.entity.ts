import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { ApplicantDocuments, Verification } from '../../kycaid/dto/kycaid.dto'

export const userPersonKey = 'person'
export const userCompanyKey = 'company'

@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID

  @Column()
  userWalletAddress: string;

  @Column()
  [userCompanyKey]: Partial<UserModel>;

  @Column()
  [userPersonKey]: Partial<UserModel>
}

export function getUserKeyByType(type: UserType) {
  switch (type) {
    case UserType.PERSON:
      return userPersonKey
    case UserType.COMPANY:
      return userCompanyKey
  }
}

export interface UserModel {
  verificationId?: string
  formUrl?: string
  verification: Partial<Verification>
  applicant?: Partial<ApplicantModel>
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
