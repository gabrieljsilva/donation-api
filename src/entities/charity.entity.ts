import Prisma from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { Donation } from './donation.entity';
import { Document } from './document.entity';
import { Load } from '../third-party/dataloader/decorators';

@ObjectType()
export class Charity implements Prisma.Charity {
  @Field()
  id: number;

  @Field()
  name: string;

  @Load(() => [Donation], {
    by: (charity) => charity.id,
    where: (donation) => donation.charityId,
    on: 'LOAD_DONATIONS_BY_CHARITY_ID',
  })
  donations?: Array<Donation>;

  @Load<Document, Charity>(() => [Document], {
    by: (charity) => charity.id,
    where: (document) => document.charityDocument.map((cd) => cd.charityId),
    on: 'LOAD_DOCUMENTS_BY_CHARITY_ID',
  })
  documents?: Array<Document>;
}
