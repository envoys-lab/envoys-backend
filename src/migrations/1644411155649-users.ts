import User from 'src/users/entities/user.entity'
import { MigrationInterface, getMongoManager } from 'typeorm'

export class users1644411155649 implements MigrationInterface {
  public async up(): Promise<void> {
    const manager = getMongoManager()
    await manager.create(User)
  }

  public async down(): Promise<void> {
    const manager = getMongoManager()
    await manager.dropCollectionIndex(User, 'Users')
  }
}
