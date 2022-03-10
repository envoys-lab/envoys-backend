import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate'
import { ObjectID, Repository } from 'typeorm'
import {
  AddCompanyRequest,
  ChangeCompanyVisibilityDto,
  DeleteCompanyResponse,
  UpdateCompanyRequest,
} from './dto/company.controller.dto'
import { Company, StageStatus } from './entity/company.entity'

@Injectable()
export class CompanyService {
  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) {}

  async getCompanies(page?: number, limit?: number): Promise<Pagination<Company>> {
    const options: IPaginationOptions = {
      page: page || 1,
      limit: limit ? (limit > 100 ? 100 : limit) : 10,
    }

    const query = {
      active: true,
    }

    return paginate<Company>(this.companyRepository, options, query)
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
