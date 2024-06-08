import { Field, ObjectType } from '@nestjs/graphql';
import Prisma from '@prisma/client';

import { Donor } from './donor.entity';
import { LoadOne } from '../third-party/dataloader/decorators';
import { LOAD_DONORS_BY_ACCESSES_IDS } from 'src/constants';

@ObjectType()
export class Access implements Prisma.Access {
  @Field()
  id: number;

  @Field()
  email: string;

  password: string;

  @LoadOne(() => Donor, { by: 'id', where: 'accessId', on: LOAD_DONORS_BY_ACCESSES_IDS })
  donor?: Donor;
}
