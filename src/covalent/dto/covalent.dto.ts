import { ObjectID } from 'typeorm'

export class QueueItem {
  token: string
  companyId: ObjectID
}

export class HoldersCountResponse {
  lastHoldersCountUpdate: number
  holdersCount: number
}

export class GetHoldersCountResponse {
  holdersCount: number
  hasMore: boolean
}
