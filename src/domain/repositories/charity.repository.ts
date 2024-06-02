import { Charity } from 'src/entities';
import { CreateCharityDto } from 'src/modules/charity/dto';
import { DOCUMENT_TYPE } from '@prisma/client';

export interface CharityFoundByNameOrDocument {
  id: number;
  name: string;
  cnpj: string;
}

export abstract class CharityRepository {
  abstract findById(id: number): Promise<Charity>;
  abstract findByIdOrThrowError(id: number): Promise<Charity>;
  abstract findAll(): Promise<Charity[]>;
  abstract create(createCharityDto: CreateCharityDto): Promise<Charity>;
  abstract update(id: number, name: string): Promise<Charity>;
  abstract deleteById(id: number): Promise<Charity>;
  abstract findByIds(ids: Array<number>): Promise<Array<Charity>>;
  abstract findCharitiesByNameOrDocument(
    name: string,
    type: DOCUMENT_TYPE,
    document: string,
  ): Promise<Array<CharityFoundByNameOrDocument>>;

  abstract findCharitiesByDocumentsIds(documentsIds: Array<number>): Promise<Array<Charity>>;
}
