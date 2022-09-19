import { HttpService } from '@nestjs/axios'
import { map, lastValueFrom } from 'rxjs'
import { Injectable, Logger } from '@nestjs/common'
import { ObjectID } from 'mongodb'
import { GetHoldersCountResponse, HoldersCountResponse, QueueItem } from './dto/covalent.dto'
import { Company } from 'src/company/entity/company.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class CovalentService {
  private readonly logger: Logger = new Logger()
  private queue: QueueItem[] = []

  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>, private httpService: HttpService) {}

  @Cron('0 1 * * * *')
  async updateQueue() {
    const queueLength = this.queue.length

    if (queueLength == 0) {
      this.logger.log(`${this.constructor.name}: Nothing in the queue to update`)
      return
    }

    this.logger.log(`${this.constructor.name}: ${queueLength} companies found in the queue to update`)

    this.queue.forEach((queueItem, i) => {
      setTimeout(async () => {
        const updateData = await this.updateHoldersCount(queueItem.token, queueItem.companyId)
        if (!updateData) {
          return
        }

        const updatedCompany = await this.updateCompany(
          queueItem.companyId,
          updateData.holdersCount,
          updateData.lastHoldersCountUpdate,
        )

        if (updatedCompany) {
          const index = this.queue.indexOf(queueItem)
          this.queue.splice(index, 1)
        }
      }, i * 2000)
    })
  }

  async updateHoldersCount(token: string, companyId: ObjectID): Promise<HoldersCountResponse> {
    const holdersCount = await this.getHoldersCount(token, companyId)

    if (holdersCount == null) {
      this.logger.warn(`${this.constructor.name}: Unable to update holdersCount for: ${companyId}`)
      return { lastHoldersCountUpdate: Date.now(), holdersCount: 0 }
    }

    return { lastHoldersCountUpdate: Date.now(), holdersCount: holdersCount }
  }

  private async getHoldersCount(token: string, companyId: ObjectID) {
    let isNeededRequest = true
    let currentPage = 0
    let holdersCount = 0

    while (isNeededRequest) {
      const data = await this.getHoldersCountRequest(token, companyId, currentPage)
      if (!data) {
        return
      }

      holdersCount += data.holdersCount
      isNeededRequest = data.hasMore
      currentPage++
    }

    return holdersCount
  }

  private async getHoldersCountRequest(token: string, companyId: ObjectID, page: number): Promise<GetHoldersCountResponse> {
    try {
      const config = {
        params: {
          ['page-number']: page,
        },
      }
      const request = this.httpService.get(`tokens/${token}/token_holders/`, config).pipe(map((response) => response.data))
      const result = await lastValueFrom(request)

      return {
        holdersCount: result.data?.items?.length,
        hasMore: result.data?.pagination?.has_more,
      }
    } catch (e) {
      this.addCompanyToQueue(token, companyId)
      return
    }
  }

  private addCompanyToQueue(token: string, companyId: ObjectID) {
    const newQueueItem = { token: token, companyId: companyId }
    const isItemInQueue = this.queue.some((queueItem) => JSON.stringify(queueItem) === JSON.stringify(newQueueItem))

    if (!isItemInQueue) {
      this.queue.push(newQueueItem)
    }
  }

  private async updateCompany(companyId: ObjectID, holdersCount: number, lastHoldersCountUpdate: number) {
    const company: Company = await this.companyRepository.findOne(companyId)

    if (!company) {
      this.logger.error(`${this.constructor.name}: Unable to find company by id: ${companyId}`)
      return
    }

    const updatedCompany = {
      ...company,
      holdersCount: holdersCount,
      lastHoldersCountUpdate: lastHoldersCountUpdate,
    }

    return this.companyRepository.save(updatedCompany)
  }
}
