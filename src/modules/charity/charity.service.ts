import { Injectable } from '@nestjs/common';
import { CharityRepository } from 'src/domain/repositories';
import { CreateCharityDto } from './dto';
import { DOCUMENT_TYPE } from 'src/domain/enum';
import { ResourceAlreadyExistsException } from 'src/exceptions';

@Injectable()
export class CharityService {
  constructor(private readonly charityRepository: CharityRepository) {}

  async findAll() {
    return this.charityRepository.findAll();
  }

  async createCharity(createCharityDto: CreateCharityDto) {
    await this.checkIfCharityExistsOrThrowError(createCharityDto.name, createCharityDto.CNPJ);
    return this.charityRepository.create(createCharityDto);
  }

  async checkIfCharityExistsOrThrowError(name: string, CNPJ: string) {
    const charitiesFoundByNameOrDocument = await this.charityRepository.findCharitiesByNameOrDocument(
      name,
      DOCUMENT_TYPE.CNPJ,
      CNPJ,
    );

    const hasCharityWithName = charitiesFoundByNameOrDocument.find((charity) => charity.name === name);
    const hasCharityWithDocument = charitiesFoundByNameOrDocument.find((charity) => charity.cnpj === CNPJ);

    if (hasCharityWithName || hasCharityWithDocument) {
      const conflicts = {};
      if (hasCharityWithName) {
        conflicts['name'] = name;
      }
      if (hasCharityWithDocument) {
        conflicts['cnpj'] = CNPJ;
      }

      throw new ResourceAlreadyExistsException(conflicts);
    }
  }
}
