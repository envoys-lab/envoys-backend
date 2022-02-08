import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm'
import { KYCAidVerification } from 'src/kycaid/interface/kycaid.db.structure'

@Entity({ name: 'Users' })
export default class User extends BaseEntity {
  @ObjectIdColumn()
  _id: number

  @Column()
  userWalletAddress: string

  @Column()
  verification_id: string

  @Column()
  userType: UserType

  @Column()
  verification: Partial<KYCAidVerification>
}

enum UserType {
  COMPANY = 'COMPANY',
  PERSON = 'PERSON',
}
