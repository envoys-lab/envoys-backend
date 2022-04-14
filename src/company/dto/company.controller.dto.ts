import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator'
import { ObjectID } from 'typeorm'
import { Company, StageStatus, StageType } from '../entity/company.entity'

export interface Pagination {
  items: any[]
  meta: PaginationMeta
}

export interface PaginationOptions {
  take: number
  skip: number
}

export interface PaginationMeta {
  itemsPerPage: number
  totalItems: number
  loadedItems: number
  totalPages: number
  currentPage: number
}

export class UrlField {
  @IsNotEmpty()
  @IsUrl()
  url: string
}

export class GetCompaniesQuery {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  size?: number

  @IsOptional()
  @IsString()
  search?: string
}

export interface GetCompaniesResponse {
  general?: SearchModel
  sellType?: SearchModel
  name?: SearchModel
  homePageUrl?: SearchModel
  status?: SearchModel
}

export interface SearchModel {
  items: Company[]
  meta: SearchMeta
}

export interface SearchMeta {
  page: number
  size: number
  total: number
}

export class DocumentModel extends UrlField {
  @IsNotEmpty()
  @IsString()
  name: string
}

export class AboutModel {
  @IsNotEmpty()
  @IsString()
  text: string
}

export class TokenModel {
  @IsNotEmpty()
  @IsString()
  ticker: string

  @IsNotEmpty()
  @IsString()
  supply: string

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  distribution: string[]

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  currencies: string[]

  @IsNotEmpty()
  @IsString()
  minContribution: string
}

export class CompanyModel {
  @IsNotEmpty()
  @IsString()
  registredName: string

  @IsNotEmpty()
  @IsString()
  registredCountry: string

  @IsNotEmpty()
  @IsString()
  foundedDate: string
}

export class WhitelistModel {
  @IsNotEmpty()
  @IsString()
  fromDate: string

  @IsNotEmpty()
  @IsString()
  tillDate: string

  @IsNotEmpty()
  @IsString()
  categories: string
}

export class AdditionalCompanyDetails {
  @IsNotEmpty()
  @IsString()
  platform: string

  @ValidateNested()
  @Type(() => WhitelistModel)
  whitelist: WhitelistModel

  @IsNotEmpty()
  @IsString()
  MVP: string
}

export class DetailsModel {
  @IsOptional()
  @ValidateNested()
  @Type(() => TokenModel)
  token: TokenModel

  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyModel)
  company: CompanyModel

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  bonus: string[]

  @IsOptional()
  @ValidateNested()
  @Type(() => AdditionalCompanyDetails)
  additional: AdditionalCompanyDetails
}

export class StageModel {
  @IsEnum(StageType)
  type: StageType

  @IsNotEmpty()
  @IsString()
  startDate: string

  @IsNotEmpty()
  @IsString()
  endDate: string

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  progress: number

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  goal: number

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  raisedFunds: number

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  cap: number

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  hardcap: number

  @IsEnum(StageStatus)
  status: StageStatus

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  price: string
}

export class RoadmapModel {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  description: string
}

export class ActivityModel extends UrlField {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialStatisModel)
  socials: SocialStatisModel[]
}

export class SocialStatisModel extends UrlField {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  type: string

  @IsNotEmpty()
  @IsUrl()
  url: string
}

export class InterviewModel {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionModel)
  questions: QuestionModel[]
}

export class MemberModel {
  @IsNotEmpty()
  @IsBoolean()
  advisor: boolean

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  position: string

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  avatarUrl: string

  @ValidateNested()
  @Type(() => InterviewModel)
  interview: InterviewModel
}

export class QuestionModel {
  @IsNotEmpty()
  @IsString()
  question: string

  @IsNotEmpty()
  @IsString()
  answear: string
}

export class SocialModelSub extends UrlField {
  @IsNotEmpty()
  @IsString()
  type: string
}

export class SocialModel {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialModelSub)
  links: SocialModelSub[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialModelSub)
  feed: SocialModelSub[]
}

export class AddCompanyRequest {
  @IsNotEmpty()
  @IsBoolean()
  active: boolean

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  sellType: string[]

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  token: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsUrl()
  homePageUrl: string

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  videoUrl: string

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  logoUrl: string

  @IsOptional()
  @IsDefined()
  @ValidateNested()
  @Type(() => SocialModel)
  social: SocialModel

  @IsOptional()
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentModel)
  documents: DocumentModel[]

  @IsOptional()
  @IsDefined()
  @ValidateNested()
  @Type(() => AboutModel)
  about: AboutModel

  @IsDefined()
  @ValidateNested()
  @Type(() => DetailsModel)
  details: DetailsModel

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StageModel)
  stages: StageModel[]

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoadmapModel)
  roadmap: RoadmapModel[]

  @IsOptional()
  @IsDefined()
  @ValidateNested()
  @Type(() => ActivityModel)
  activity: ActivityModel

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberModel)
  members: MemberModel[]
}

export class ObjectIdParam {
  @IsMongoId()
  companyId: ObjectID
}

export class GetCompanyByIdParams extends ObjectIdParam {}

export class ChangeCompanyVisibilityParams extends ObjectIdParam {}

export class ChangeCompanyVisibilityDto {
  @IsNotEmpty()
  @IsBoolean()
  active: boolean
}

export class UpdateCompanyParams extends ObjectIdParam {}

export class UpdateCompanyRequest {
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  active: boolean

  @IsOptional()
  @IsEnum(StageStatus)
  status: StageStatus

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sellType: string[]

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  token: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  homePageUrl: string

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  videoUrl: string

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  logoUrl: string

  @IsOptional()
  @IsDefined()
  @ValidateNested()
  @Type(() => SocialModel)
  social: SocialModel

  @IsOptional()
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentModel)
  documents: DocumentModel[]

  @IsOptional()
  @IsDefined()
  @ValidateNested()
  @Type(() => AboutModel)
  about: AboutModel

  @IsOptional()
  @IsDefined()
  @ValidateNested()
  @Type(() => DetailsModel)
  details: DetailsModel

  @IsOptional()
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StageModel)
  stages: StageModel[]

  @IsOptional()
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoadmapModel)
  roadmap: RoadmapModel[]

  @IsOptional()
  @IsDefined()
  @ValidateNested()
  @Type(() => ActivityModel)
  activity: ActivityModel

  @IsOptional()
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberModel)
  members: MemberModel[]
}

export class DeleteCompanyParams extends ObjectIdParam {}

export interface DeleteCompanyResponse {
  message: string
}
