import Prisma from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { Donation } from './donation.entity';
import { Document } from './document.entity';
import { CharityDocument } from './charity-document.entity';
import { LoadMany } from 'src/third-party/dataloader/decorators/load-many.decorator';
import { LOAD_DOCUMENTS_BY_CHARITIES_IDS, LOAD_DONATIONS_BY_CHARITIES_IDS } from 'src/constants';
import { LoadThrough } from 'src/third-party/dataloader/decorators/load-through.decorator';

@ObjectType()
export class Charity implements Prisma.Charity {
  @Field()
  id: number;

  @Field()
  name: string;

  @LoadMany(() => Donation, { by: 'id', where: 'charityId', on: LOAD_DONATIONS_BY_CHARITIES_IDS })
  donations?: Array<Donation>;

  @LoadMany<Document, Charity>(() => Document, { by: 'id', where: 'charityId', on: LOAD_DOCUMENTS_BY_CHARITIES_IDS })
  @LoadThrough(() => CharityDocument, { joinEntity: 'charityDocument' })
  documents?: Array<Document>;
}
