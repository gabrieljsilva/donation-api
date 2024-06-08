import { Field, ObjectType } from '@nestjs/graphql';
import Prisma from '@prisma/client';

import { Access } from './access.entity';
import { LoadOne } from '../third-party/dataloader/decorators';
import { Donation } from './donation.entity';
import { Relation } from '../third-party/dataloader/types';
import { LoadMany } from 'src/third-party/dataloader/decorators/load-many.decorator';
import { LOAD_ACCESSES_BY_IDS, LOAD_DONATIONS_BY_DONORS_IDS } from 'src/constants';

@ObjectType()
export class Donor implements Prisma.Donor {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  birthDate: Date;

  @Field()
  accessId: number;

  @LoadOne<Access, Donor>(() => Access, { by: 'accessId', where: 'id', on: LOAD_ACCESSES_BY_IDS })
  access?: Relation<Access>;

  @LoadMany(() => Donation, { by: 'id', where: 'donorId', on: LOAD_DONATIONS_BY_DONORS_IDS })
  donations?: Array<Donation>;
}
