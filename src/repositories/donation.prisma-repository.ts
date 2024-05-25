import { Injectable } from '@nestjs/common';
import { CharityRepository, DonationRepository, DonorRepository } from '../domain/repositories';
import { PrismaService } from '../infra/database';
import { Donation } from '../entities/donation.entity';

@Injectable()
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

  async findAllByCharityId(charityId: number): Promise<Array<Donation>> {
    return this.prisma.donation.findMany({
      where: { charityId },
    });
  }

  async findAllByDonorId(donorId: number): Promise<Array<Donation>> {
    return this.prisma.donation.findMany({
      where: { donorId },
    });
  }
}
