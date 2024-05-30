import { Field, ObjectType } from '@nestjs/graphql';
import Prisma from '@prisma/client';

import { Donor } from './donor.entity';
import { Load } from '../third-party/dataloader/decorators';

@ObjectType()
export class Access implements Prisma.Access {
  @Field()
  id: number;

  @Field()
  email: string;

  password: string;

  @Load(() => Donor, {
    by: (access) => access.id,
    where: (donor) => donor.accessId,
    on: 'LOAD_DONOR_BY_ACCESS_ID',
  })
  donor?: Donor;
}
