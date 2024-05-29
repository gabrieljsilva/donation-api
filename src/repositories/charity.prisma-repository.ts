import { Injectable } from '@nestjs/common';
import { CharityRepository } from '../domain/repositories';
import { Charity } from '../entities';
import { PrismaService } from '../infra/database';
import { DataloaderHandler, AliasFor } from '../third-party/dataloader/decorators';

@Injectable()
@AliasFor(() => CharityRepository)
export class CharityPrismaRepository implements CharityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string): Promise<Charity> {
    const charityAlreadyExists = await this.prisma.charity.findFirst({
      where: { name },
    });

    if (charityAlreadyExists) {
      throw new Error(`Charity ${name} already exists`);
    }

    return this.prisma.charity.create({ data: { name } });
  }

  async deleteById(id: number): Promise<Charity> {
    await this.findByIdOrThrowError(id);
    return this.prisma.charity.delete({ where: { id } });
  }

  async findAll(): Promise<Charity[]> {
    return this.prisma.charity.findMany();
  }

  async findById(id: number): Promise<Charity> {
    return this.prisma.charity.findUnique({ where: { id } });
  }

  async findByIdOrThrowError(id: number): Promise<Charity> {
    const charity = await this.findById(id);

    if (!charity) {
      throw new Error(`Charity with id ${id} not found`);
    }

    return charity;
  }

  async update(id: number, name: string): Promise<Charity> {
    await this.findByIdOrThrowError(id);
    return this.prisma.charity.update({ where: { id }, data: { name } });
  }

  @DataloaderHandler('LOAD_CHARITY_BY_ID')
  async findByIds(ids: Array<number>): Promise<Array<Charity>> {
    return this.prisma.charity.findMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
