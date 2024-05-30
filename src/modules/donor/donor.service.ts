import { Injectable } from '@nestjs/common';
import { DonorRepository } from '../../domain/repositories';

@Injectable()
export class DonorService {
  constructor(private readonly donorRepository: DonorRepository) {}

  async findAll() {
    return this.donorRepository.findAll();
  }
}
