import { Injectable } from '@nestjs/common';
import { DocumentRepository } from 'src/domain/repositories';
import { Document } from 'src/entities';

@Injectable()
export class DocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async findAllByCharityId(charityId: number): Promise<Array<Document>> {
    return this.documentRepository.findAllByCharityId(charityId);
  }
}
