import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectID, Repository } from 'typeorm'
import {
  AddCompanyRequest,
  ChangeCompanyVisibilityDto,
  DeleteCompanyResponse,
  Pagination,
  PaginationOptions,
  UpdateCompanyRequest,
} from './dto/company.controller.dto'
import { Company, StageStatus } from './entity/company.entity'

@Injectable()
export class CompanyService {
  private readonly keyToFind = ['sellType', 'name', 'status', 'homePageUrl']
  private readonly defaultPageSize = 10

  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) {}

  async getCompanies(page?: number, size?: number, search?: string, isAdminController?): Promise<Pagination> {
    return this.paginate(page, size, search, isAdminController)
  }

  private async paginate(page?: number, size?: number, search?: string, isAdminController?) {
    const query = this.getCompaniesQuery(search, isAdminController)
    const options = this.getPaginationOptions(page, size)

    const [result, total] = await this.companyRepository.manager.findAndCount(Company, {
      ...query,
      ...options,
    })

    return {
      items: result,
      meta: {
        itemsPerPage: Number(size) || this.defaultPageSize,
        totalItems: total || 0,
        loadedItems: result.length,
        totalPages: size ? Math.ceil(total / size) : Math.ceil(total / this.defaultPageSize),
        currentPage: Number(page) || 1,
      },
    }
  }

  private getPaginationOptions(page: number, size: number): PaginationOptions {
    size = size || this.defaultPageSize

    return {
      take: Number(size) || this.defaultPageSize,
      skip: page ? (page - 1) * size : 0,
    }
  }

  private getCompaniesQuery(search: string, isAdminController = false): object {
    if (!search && isAdminController) {
      return
    }

    if (!search && !isAdminController) {
      return { where: { active: true } }
    }

    const keyFindParameters = { $regex: search, $options: 'i' }
    const query = { $or: [] }
    let active = {}

    if (!isAdminController) {
      active = { active: true }
    }

    for (const key of this.keyToFind) {
      query.$or.push({ [key]: { ...keyFindParameters } })
    }

    return { where: { $and: [active, { $or: [...query.$or] }] } }
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
      dto.status = this.getCompanyStatus(dto)
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
      if (this.isLeftHavePastStatus(dto)) {
        return stages[0].status
      }

      return stages[1].status
    }

    return stages[0].status
  }

  private isLeftHavePastStatus(dto: Partial<Company>): boolean {
    const stages = dto.stages

    for (let i = 1; i < stages.length; i++) {
      if (stages[i].status != StageStatus.PAST) {
        return false
      }
    }

    return true
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
