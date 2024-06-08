import Prisma from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { DOCUMENT_TYPE } from 'src/domain/enum';
import { Charity } from 'src/entities/charity.entity';
import { LoadOne } from 'src/third-party/dataloader/decorators';
import { Relation } from 'src/third-party/dataloader/types';
import { LoadThrough } from 'src/third-party/dataloader/decorators/load-through.decorator';
import { CharityDocument } from 'src/entities/charity-document.entity';
import { LOAD_CHARITIES_BY_DOCUMENTS_IDS } from 'src/constants';

@ObjectType()
export class Document implements Prisma.Document {
  @Field()
  id: number;

  @Field()
  document: string;

  @Field()
  type: DOCUMENT_TYPE;

  @LoadOne<Charity, Document>(() => Charity, {
    by: 'id',
    where: 'documentId',
    on: LOAD_CHARITIES_BY_DOCUMENTS_IDS,
  })
  @LoadThrough(() => CharityDocument, { joinEntity: 'charityDocuments' })
  charity?: Relation<Charity>;
}
