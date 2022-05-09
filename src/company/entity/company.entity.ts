import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'Companies' })
export class Company extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID

  @Column()
  active: boolean

  @Column()
  status: StageStatus

  @Column()
  name: string

  @Column()
  token: string

  @Column()
  lastHoldersCountUpdate: number

  @Column()
  holdersCount: number

  @Column()
  sellType: string[]

  @Column()
  description: string

  @Column()
  homePageUrl: string

  @Column()
  videoUrl: string

  @Column()
  logoUrl: string

  @Column()
  social: SocialModel

  @Column()
  documents: DocumentModel[]

  @Column()
  about: AboutModel

  @Column()
  details: DetailsModel

  @Column()
  stages: StageModel[]

  @Column()
  roadmap: RoadmapModel[]

  @Column()
  activity: ActivityModel

  @Column()
  members: MemberModel[]
}

export interface SocialModel {
  links: SocialModelSub[]
  feed: SocialModelSub[]
}

export interface UrlField {
  url: string
}

export interface SocialModelSub extends UrlField {
  type: string
}

export interface DocumentModel extends UrlField {
  name: string
}

export interface AboutModel {
  text: string
}

export interface DetailsModel {
  token: TokenModel
  company: CompanyModel
  bonus: string[]
  additional: AdditionalCompanyDetails
}

export interface TokenModel {
  ticker: string
  supply: string
  distribution: string[]
  currencies: string[]
  minContribution: string
}

export interface CompanyModel {
  registredName: string
  registredCountry: string
  foundedDate: string
}

export interface AdditionalCompanyDetails {
  platform: string
  whitelist: WhitelistModel
  MVP: string
}

export interface WhitelistModel {
  fromDate: string
  tillDate: string
  categories: string
}

export interface StageModel {
  type: StageType
  startDate: string
  endDate: string
  progress: number
  goal: number
  raisedFunds: number
  cap: number
  hardcap: number
  status: StageStatus
  price: string
}

export interface RoadmapModel {
  title: string
  description: string
}

export interface ActivityModel extends UrlField {
  socials: SocialStatisModel[]
}

export interface SocialStatisModel extends UrlField {
  title: string
  type: string
  url: string
}

export interface MemberModel {
  advisor: boolean
  name: string
  position: string
  avatarUrl: string
  interview: InterviewModel
}

export interface InterviewModel {
  questions: QuestionModel[]
}

export interface QuestionModel {
  question: string
  answear: string
}

export enum StageType {
  ICO = 'ICO',
  PRIVATE_SALE = 'Private Sale',
  PRE_SALE = 'Pre Sale',
  RELEASE = 'Release',
}

export enum StageStatus {
  PAST = 'past',
  ONGOING = 'ongoing',
  UPCOMING = 'upcoming',
}
