import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { Verification } from '../../kycaid/dto/kycaid.dto'

@Entity({ name: 'Users' })
export default class User extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID

  @Column()
  userWalletAddress: string

  @Column()
  companyVerificationId: string

  @Column()
  personVerificationId: string

  @Column()
  companyVerification: Partial<Verification>

  @Column()
  personVerification: Partial<Verification>
}

export enum UserType {
  COMPANY = 'COMPANY',
  PERSON = 'PERSON',
}
