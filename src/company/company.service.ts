import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectID, Repository } from 'typeorm'
import {
  AddCompanyRequest,
  ChangeCompanyVisibilityDto,
  DeleteCompanyResponse,
  GetCompaniesResponse,
  UpdateCompanyRequest,
} from './dto/company.controller.dto'
import { Company, StageStatus } from './entity/company.entity'

@Injectable()
export class CompanyService {
  private readonly tagsForSearch = ['sellType', 'name', 'homePageUrl', 'status']
  private readonly searchTake: number

  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>, private configService: ConfigService) {
    this.searchTake = this.configService.get<number>('app.searchTake')
  }

  async getCompanies(page: number, search: string): Promise<GetCompaniesResponse> {
    if (search) {
      let response: GetCompaniesResponse

      for (const tag of this.tagsForSearch) {
        const data = await this.findCopamiesByCategory(page, tag, search)

        response = {
          ...response,
          ...data,
        }
      }

      if (Object.keys(response).length === 0) {
        throw new NotFoundException(`There are no items matching query`)
      }

      return response
    }

    return this.findCopamiesByCategory(page, 'general')
  }

  private async findCopamiesByCategory(page: number, tag: string, search?: string): Promise<GetCompaniesResponse> {
    const keyword = search ? search.replace(/[^a-zA-Z0-9]/g, '') : ''
    const currentPage = page ? page : 1
    const skip = (currentPage - 1) * this.searchTake

    let whereQuery = {}

    if (tag && keyword) {
      whereQuery = { [tag]: { $regex: `^${keyword}`, $options: 'i' }, active: true }
    } else if (tag == 'sellType') {
      whereQuery = { [tag]: { $gt: `^${keyword}` }, active: true }
    } else if (tag == 'general') {
      whereQuery = { active: true }
    }

    const data = await this.companyRepository.findAndCount({
      where: { ...whereQuery },
      skip: skip,
      take: this.searchTake,
    })

    return this.paginateResponse(data, currentPage, tag)
  }

  private paginateResponse(data, page: number, tag: string): GetCompaniesResponse {
    const [result, total] = data
    const size = result.length

    const fetchedData = {
      [tag]: {
        items: result,
        meta: {
          page: page,
          size: size,
          total: total,
        },
      },
    }

    return result.length === 0 ? null : fetchedData
  }

  async getCompanyById(companyId: ObjectID): Promise<Company> {
    const company: Company = await this.companyRepository.findOne(companyId)

    if (!company) {
      throw new NotFoundException(`Unable to find company by id: ${companyId}`)
    }

    return company
  }

  async addCompany(dto: AddCompanyRequest): Promise<Company> {
    const company: Company = await this.companyRepository.findOne({ where: { name: dto.name } })

    if (company) {
      throw new BadRequestException(`Company with name: ${dto.name} already exist!`)
    }

    const newCompany = this.companyRepository.create({ ...dto })

    return this.updateCompanyDB(newCompany, dto)
  }

  async changeCompanyActive(companyId: ObjectID, dto: ChangeCompanyVisibilityDto): Promise<Company> {
    const company: Company = await this.companyRepository.findOne(companyId)

    if (!company) {
      throw new NotFoundException(`Unable to find company by id: ${companyId}`)
    }

    const updatedCompany = {
      ...company,
      active: dto.active,
    }

    return this.companyRepository.save(updatedCompany)
  }

  async updateCompany(companyId: ObjectID, dto: UpdateCompanyRequest): Promise<Company> {
    const company: Company = await this.companyRepository.findOne(companyId)

    if (!company) {
      throw new NotFoundException(`Unable to find company by id: ${companyId}`)
    }

    return this.updateCompanyDB(company, dto)
  }

  private updateCompanyDB(company: Company, dto: Partial<Company>): Promise<Company> {
    if (dto.stages) {
      company.status = this.getCompanyStatus(dto)
    }

    const updatedCompany = {
      ...company,
      ...dto,
    }

    return this.companyRepository.save(updatedCompany)
  }

  private getCompanyStatus(dto: Partial<Company>): StageStatus {
    const stages = dto.stages

    if (stages && stages.length === 1) {
      return stages[0].status
    } else if (stages.length > 1 && stages[0].status == StageStatus.UPCOMING) {
      return stages[1].status
    }
  }

  async deleteCompany(companyId: ObjectID): Promise<DeleteCompanyResponse> {
    const company: Company = await this.companyRepository.findOne(companyId)

    if (!company) {
      throw new NotFoundException(`Unable to find company by id: ${companyId}`)
    }

    await this.companyRepository.delete(companyId)

    return { message: `Company ${companyId} has been successfully deleted` }
  }
}
