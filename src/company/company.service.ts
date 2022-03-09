import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
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
  private readonly keysForSearch = ['sellType', 'name', 'homePageUrl', 'status']
  private readonly searchTake: number = 10

  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) {}

  async getCompanies(page: number, search: string): Promise<GetCompaniesResponse> {
    if (search) {
      return this.findCompanyesByKeys(page, search)
    }

    return this.findCopamiesByOneKey(page, 'general')
  }

  private async findCompanyesByKeys(page, search): Promise<GetCompaniesResponse> {
    let response: GetCompaniesResponse

    for (const key of this.keysForSearch) {
      const data = await this.findCopamiesByOneKey(page, key, search)

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

  private async findCopamiesByOneKey(page: number, key: string, search?: string): Promise<GetCompaniesResponse> {
    const keyword = search ? search.replace(/[^a-zA-Z0-9]/g, '') : ''
    const currentPage = page ? page : 1
    const skip = (currentPage - 1) * this.searchTake

    const data = await this.companyRepository.findAndCount({
      where: { ...this.getQuery(key, keyword) },
      skip: skip,
      take: this.searchTake,
    })

    return this.paginateResponse(data, currentPage, key)
  }

  private getQuery(key: string, keyword: string) {
    switch (key) {
      case 'general':
        return { active: true }
      case 'sellType':
        return { [key]: { $gt: `^${keyword}` }, active: true }
      default:
        return { [key]: { $regex: `^${keyword}`, $options: 'i' }, active: true }
    }
  }

  private paginateResponse(data, page: number, key: string): GetCompaniesResponse {
    const [result, total] = data
    const size = result.length

    const fetchedData = {
      [key]: {
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

    return this.updateCompanyStatus(newCompany, dto)
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

    return this.updateCompanyStatus(company, dto)
  }

  private updateCompanyStatus(company: Company, dto: Partial<Company>): Promise<Company> {
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

    if (stages.length > 1 && stages[0].status == StageStatus.UPCOMING) {
      return stages[1].status
    }

    return stages[0].status
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
