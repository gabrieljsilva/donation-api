import { Field, ObjectType } from '@nestjs/graphql';
import Prisma from '@prisma/client';

import { Donor } from './donor.entity';
import { LoadField } from '../third-party/dataloader/decorators';

@ObjectType()
export class Access implements Prisma.Access {
  @Field()
  id: number;

  @Field()
  email: string;

  password: string;

  @LoadField(() => Donor, (access) => access.id, (parent) => parent.accessId, 'LOAD_DONOR_BY_ACCESS_ID')
  donor?: Donor;
}
