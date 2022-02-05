import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm'
import { VerificationStatus } from '../enum/user.status.enum'

@Entity({ name: 'Users' })
export default class User extends BaseEntity {
  @ObjectIdColumn()
  _id: number

  @Column()
  userWalletAddress: string

  @Column()
  request_id: string

  @Column()
  type: string

  @Column()
  verification_id: string

  @Column()
  status: VerificationStatus

  @Column()
  verified: boolean

  @Column()
  verifications: object
}
