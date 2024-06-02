import Prisma, { CharityDocument } from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { DOCUMENT_TYPE } from 'src/domain/enum';
import { Charity } from 'src/entities/charity.entity';
import { Load } from 'src/third-party/dataloader/decorators';
import { Relation } from 'src/third-party/dataloader/types';

@ObjectType()
export class Document implements Prisma.Document {
  @Field()
  id: number;

  @Field()
  document: string;

  @Field()
  type: DOCUMENT_TYPE;

  charityDocument?: Array<CharityDocument>;

  // Replace this to a many to one relationship
  @Load<Charity, Document>(() => Charity, {
    by: (document) => document.id,
    where: (charity) => charity.charityDocuments.map((document) => document.id),
    on: 'LOAD_CHARITIES_BY_DOCUMENTS_IDS',
  })
  charity?: Relation<Charity>;
}
