import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectID, Repository } from 'typeorm'
import {
  AddCompanyRequest,
  ChangeCompanyVisibilityDto,
  DeleteCompanyResponse,
  GetCompaniesListQuery,
  GetCompaniesListResponse,
  UpdateCompanyRequest,
} from './dto/company.controller.dto'
import { Company } from './entity/company.entity'

@Injectable()
export class CompanyService {
  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) {}

  async getCompaniesList(query: GetCompaniesListQuery): Promise<GetCompaniesListResponse> {
    const skip = query.skip || 0
    const search = query.search || ''

    const data = await this.companyRepository.findAndCount({
      where: { name: { $regex: `^${search}` } },
      skip: skip,
      take: 5,
    })

    return this.paginateResponse(data, 0)
  }

  private paginateResponse(data, skip): GetCompaniesListResponse {
    const [result, total] = data
    const loaded = result.length
    const left = total - (skip + loaded)
    const nextSkipValue = left ? left + total : 0

    return {
      data: [...result],
      total: total,
      loaded: loaded,
      left: left,
      nextSkipValue: nextSkipValue,
    }
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
      return company
    }

    const newCompany = this.companyRepository.create({ ...dto })
    return this.companyRepository.save(newCompany)
  }

  async changeCompanyVisibility(companyId: ObjectID, dto: ChangeCompanyVisibilityDto): Promise<Company> {
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

    const updatedCompany = {
      ...company,
      ...dto,
    }

    return this.companyRepository.save(updatedCompany)
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
