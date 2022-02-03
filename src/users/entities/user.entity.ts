import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'Users' })
export default class User extends BaseEntity {
  @ObjectIdColumn()
  _id: number

  @Column()
  userWalletAddress: string
}
