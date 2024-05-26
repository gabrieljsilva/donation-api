import { Injectable } from '@nestjs/common';
import { CharityRepository, DonationRepository, DonorRepository } from '../domain/repositories';
import { PrismaService } from '../infra/database';
import { Donation } from '../entities';
import { Dataloader, ResolveProvider } from '../third-party/dataloader/decorators';

@Injectable()
@ResolveProvider(DonationRepository)
export class DonationPrismaRepository implements DonationRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly donorRepository: DonorRepository,
    private readonly charityRepository: CharityRepository,
  ) {}

  async create(amount: number, donorId: number, charityId: number): Promise<Donation> {
    if (amount === 0) {
      throw new Error('Donation amount must be greater than 0');
    }

    await Promise.all([
      this.donorRepository.findByIdOrThrowError(donorId),
      this.charityRepository.findByIdOrThrowError(charityId),
    ]);

    return this.prisma.donation.create({
      data: {
        amount,
        charityId,
        donorId,
      },
    });
  }

  async findAll(): Promise<Array<Donation>> {
    return this.prisma.donation.findMany();
  }

  @Dataloader('LOAD_DONATIONS_BY_CHARITY_ID')
  async findAllByCharitiesIds(charitiesIds: Array<number>): Promise<Array<Donation>> {
    return this.prisma.donation.findMany({
      where: {
        charityId: {
          in: charitiesIds,
        },
      },
    });
  }

  @Dataloader('LOAD_DONATIONS_BY_DONOR_ID')
  async findAllByDonorIds(donorsIds: Array<number>): Promise<Array<Donation>> {
    return this.prisma.donation.findMany({
      where: {
        donorId: {
          in: donorsIds,
        },
      },
    });
  }
}
