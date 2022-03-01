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

export class UrlField {
  @IsNotEmpty()
  @IsUrl()
  url: string
}

export class GetCompaniesListQuery {
  @IsOptional()
  @IsNumber()
  skip?: number

  @IsOptional()
  @IsString()
  search?: string
}

export interface GetCompaniesListResponse {
  data: Company[]
  total: number
  left: number
  loaded: number
  nextSkipValue: number
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

export class DetailsModel {
  @IsNotEmpty()
  @IsString()
  mainText: string

  @IsNotEmpty()
  @IsString()
  secondaryText: string

  @IsNotEmpty()
  @IsString()
  additionalText: string
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

  @IsNotEmpty()
  @IsNumber()
  progress: number

  @IsNotEmpty()
  @IsNumber()
  goal: number

  @IsNotEmpty()
  @IsNumber()
  raisedFunds: number

  @IsNotEmpty()
  @IsNumber()
  cap: number

  @IsNotEmpty()
  @IsNumber()
  hardcap: number

  @IsEnum(StageStatus)
  status: StageStatus

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
  @IsString()
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

  @IsNotEmpty()
  @IsString()
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
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  homePageUrl: string

  @IsNotEmpty()
  @IsUrl()
  videoUrl: string

  @IsNotEmpty()
  @IsUrl()
  logoUrl: string

  @IsDefined()
  @ValidateNested()
  @Type(() => SocialModel)
  social: SocialModel

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentModel)
  documents: DocumentModel[]

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
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
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
