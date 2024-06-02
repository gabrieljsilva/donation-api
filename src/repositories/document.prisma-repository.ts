import { Injectable } from '@nestjs/common';
import { DocumentRepository } from 'src/domain/repositories';
import { PrismaService } from 'src/infra/database';
import { Document } from 'src/entities';
import { DataloaderHandler } from 'src/third-party/dataloader/decorators';

@Injectable()
export class DocumentPrismaRepository implements DocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  @DataloaderHandler('LOAD_DOCUMENTS_BY_CHARITIES_IDS')
  async findAllByCharitiesIds(charitiesIds: Array<number>): Promise<Array<Document>> {
    return this.prisma.document.findMany({
      where: {
        charityDocument: {
          some: {
            charityId: {
              in: charitiesIds,
            },
          },
        },
      },
    });
  }
}
