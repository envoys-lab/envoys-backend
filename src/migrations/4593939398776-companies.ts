import { Company } from 'src/company/entity/company.entity'
import { MigrationInterface } from 'typeorm'
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner'

const DEFAULT_COMPANY_NAME = 'Default Company'

export class Companies4593939398776 implements MigrationInterface {
  async up(queryRunner: MongoQueryRunner): Promise<void> {
    const company = new Company()
    company.name = DEFAULT_COMPANY_NAME
    company.active = false

    await queryRunner.insertOne('Companies', company)
  }

  async down(queryRunner: MongoQueryRunner): Promise<void> {
    await queryRunner.findOneAndDelete('Companies', { name: DEFAULT_COMPANY_NAME })
  }
}
