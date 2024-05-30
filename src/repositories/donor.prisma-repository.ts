import { Injectable } from '@nestjs/common';
import { DonorRepository } from '../domain/repositories';
import { Donor } from '../entities';
import { PrismaService } from '../infra/database';
import { DataloaderHandler, AliasFor } from '../third-party/dataloader/decorators';

@Injectable()
@AliasFor(() => DonorRepository)
export class DonorPrismaRepository extends DonorRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAll(): Promise<Array<Donor>> {
    const donors = await this.prisma.donor.findMany();
    return donors as Array<Donor>;
  }

  @DataloaderHandler('LOAD_DONOR_BY_ACCESS_ID')
  async findByAccessIds(accessIds: Array<number>): Promise<Array<Donor>> {
    return this.prisma.donor.findMany({
      where: {
        accessId: {
          in: accessIds,
        },
      },
    });
  }

  async findById(id: number): Promise<Donor> {
    return this.prisma.donor.findFirst({ where: { id } });
  }

  async create(accessId: number, name: string, birthDate: Date): Promise<Donor> {
    return this.prisma.donor.create({
      data: { name, birthDate, accessId },
    });
  }

  async findByIdOrThrowError(id: number): Promise<Donor> {
    const donor = await this.findById(id);

    if (!donor) {
      throw new Error('Donor not found');
    }

    return donor;
  }

  async findByAccessId(accessId: number): Promise<Donor> {
    return this.prisma.donor.findFirst({
      where: { accessId },
    });
  }

  @DataloaderHandler('LOAD_DONOR_BY_ID')
  async findByIds(ids: number[]): Promise<Array<Donor>> {
    return this.prisma.donor.findMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
