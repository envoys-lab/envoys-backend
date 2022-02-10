import { MigrationInterface } from 'typeorm'
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner'
import User, { UserType } from 'src/user/entity/user.entity'

const DEFAULT_WALLET_ADDRESS = '0x484D3D5Bbc8114B794767AeabDeCf7887FDd04C2'

export class Users1644411155649 implements MigrationInterface {
  async up(queryRunner: MongoQueryRunner): Promise<void> {
    const user = new User()
    user.userWalletAddress = DEFAULT_WALLET_ADDRESS
    user.userType = UserType.PERSON

    await queryRunner.insertOne('Users', user)
  }

  async down(queryRunner: MongoQueryRunner): Promise<void> {
    await queryRunner.findOneAndDelete('Users', { userWalletAddress: DEFAULT_WALLET_ADDRESS })
  }
}
