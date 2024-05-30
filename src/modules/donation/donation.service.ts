import { Injectable } from '@nestjs/common';
import { DonationRepository, DonorRepository } from '../../domain/repositories';
import { Access } from '../../entities';
import { DonateDto } from './dto';

@Injectable()
export class DonationService {
  constructor(
    private readonly donationRepository: DonationRepository,
    private readonly donorRepository: DonorRepository,
  ) {}

  async findAll() {
    return this.donationRepository.findAll();
  }

  async donate(donateDto: DonateDto, access: Access) {
    const donor = await this.donorRepository.findByAccessId(access.id);
    return this.donationRepository.create(donateDto.amount, donor.id, donateDto.charityId);
  }
}
