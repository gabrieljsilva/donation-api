import { Injectable } from '@nestjs/common';
import { DonorRepository } from '../domain/repositories';
import { Donor } from '../entities';
import { PrismaService } from '../infra/database';
import { Dataloader, ResolveProvider } from '../third-party/dataloader/decorators';

@Injectable()
@ResolveProvider(DonorRepository)
export class DonorPrismaRepository extends DonorRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAll(): Promise<Array<Donor>> {
    const donors = await this.prisma.donor.findMany();
    return donors as Array<Donor>;
  }

  @Dataloader('LOAD_DONOR_BY_ACCESS_ID')
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
    const donor = await this.prisma.donor.findFirst({ where: { id } });
    return donor as Donor;
  }

  async create(accessId: number, name: string, birthDate: Date): Promise<Donor> {
    const donor = await this.prisma.donor.create({
      data: { name, birthDate, accessId },
    });

    return donor as Donor;
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

  @Dataloader('LOAD_DONOR_BY_ID')
  async findByIds(ids: number[]): Promise<Array<Donor>> {
    return this.prisma.donor.findMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
