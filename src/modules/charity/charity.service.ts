import { Injectable } from '@nestjs/common';
import { CharityRepository } from '../../domain/repositories';
import { CreateCharityDto } from './dto';

@Injectable()
export class CharityService {
  constructor(private readonly charityRepository: CharityRepository) {}

  async findAll() {
    return this.charityRepository.findAll();
  }

  async createCharity(createCharityDto: CreateCharityDto) {
    return this.charityRepository.create(createCharityDto.name);
  }
}
