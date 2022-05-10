import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { CovalentHttpConfigService } from './covalent.http.config'
import { CovalentService } from './covalent.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Company } from 'src/company/entity/company.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    HttpModule.registerAsync({ useClass: CovalentHttpConfigService }),
    ScheduleModule.forRoot(),
  ],
  providers: [CovalentService],
  exports: [CovalentService],
})
export class CovalentModule {}
