import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { Verification } from '../../kycaid/dto/kycaid.dto'

@Entity({ name: 'Users' })
export default class User extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID

  @Column()
  userWalletAddress: string

  @Column()
  company: UserModel

  @Column()
  person: UserModel
}

export interface UserModel {
  verificationId?: string
  formUrl?: string
  verification: Partial<Verification>
}

export enum UserType {
  COMPANY = 'COMPANY',
  PERSON = 'PERSON',
}
