import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import { Verification } from '../../kycaid/dto/kycaid.dto'

@Entity({ name: 'Users' })
export default class User extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID

  @Column()
  userWalletAddress: string

  @Column()
  verificationId: string

  @Column()
  userType: UserType

  @Column()
  verification: Partial<Verification>
}

export enum UserType {
  COMPANY = 'COMPANY',
  PERSON = 'PERSON',
}
