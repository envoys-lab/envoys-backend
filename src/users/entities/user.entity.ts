import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'Users' })
export default class User extends BaseEntity {
  @ObjectIdColumn()
  _id: number

  @Column()
  userWalletAddress: string

  @Column()
  KYC_request_id: string

  @Column()
  KYC_type: string

  @Column()
  KYC_verification_id: string

  @Column()
  KYC_status: 'unused' | 'pending' | 'completed'

  @Column()
  KYC_verified: boolean

  @Column()
  KYC_verifications: object

  @Column()
  KYC_aplicant: object
}
