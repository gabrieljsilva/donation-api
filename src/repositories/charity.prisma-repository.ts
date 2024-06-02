import { Injectable } from '@nestjs/common';
import { CharityFoundByNameOrDocument, CharityRepository } from '../domain/repositories';
import { Charity } from '../entities';
import { PrismaService } from '../infra/database';
import { DataloaderHandler, AliasFor } from '../third-party/dataloader/decorators';
import { CreateCharityDto } from '../modules/charity/dto';
import { DOCUMENT_TYPE } from '../domain/enum';

@Injectable()
@AliasFor(() => CharityRepository)
export class CharityPrismaRepository implements CharityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCharityDto: CreateCharityDto): Promise<Charity> {
    const { name, CNPJ } = createCharityDto;

    return this.prisma.charity.create({
      data: {
        name,
        charityDocuments: {
          create: {
            document: {
              create: {
                document: CNPJ,
                type: DOCUMENT_TYPE.CNPJ,
              },
            },
          },
        },
      },
    });
  }

  async deleteById(id: number): Promise<Charity> {
    await this.findByIdOrThrowError(id);
    return this.prisma.charity.delete({ where: { id } });
  }

  async findAll(): Promise<Charity[]> {
    return this.prisma.charity.findMany();
  }

  async findById(id: number): Promise<Charity> {
    return this.prisma.charity.findUnique({ where: { id } });
  }

  async findByIdOrThrowError(id: number): Promise<Charity> {
    const charity = await this.findById(id);

    if (!charity) {
      throw new Error(`Charity with id ${id} not found`);
    }

    return charity;
  }

  async update(id: number, name: string): Promise<Charity> {
    await this.findByIdOrThrowError(id);
    return this.prisma.charity.update({ where: { id }, data: { name } });
  }

  @DataloaderHandler('LOAD_CHARITY_BY_ID')
  async findByIds(ids: Array<number>): Promise<Array<Charity>> {
    return this.prisma.charity.findMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async findCharitiesByNameOrDocument(name: string, type: DOCUMENT_TYPE, CNPJ: string) {
    return this.prisma.$queryRaw<Array<CharityFoundByNameOrDocument>>`
      SELECT
      Charity.id as id,
      Charity.name as name,
      Document.document as cnpj
          FROM charities Charity
              LEFT JOIN charity_documents CharityDocument
                  ON Charity.id = CharityDocument.charity_id
              LEFT JOIN documents Document
                  ON CharityDocument.document_id = Document.id
              WHERE Charity.name = ${name}
                 OR (Document.type = 'CNPJ' AND Document.document = ${CNPJ});
    `;
  }
}
