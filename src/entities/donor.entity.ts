import { Field, ObjectType } from '@nestjs/graphql';
import Prisma from '@prisma/client';

import { Access } from './access.entity';
import { Load } from '../third-party/dataloader/decorators';
import { Donation } from './donation.entity';

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

  @Load(() => Access, { by: (donor) => donor.accessId, where: (access) => access.id, on: 'LOAD_ACCESS_BY_ID' })
  access?: Access;

  @Load(() => [Donation], {
    by: (donor) => donor.id,
    where: (donation) => donation.donorId,
    on: 'LOAD_DONATIONS_BY_DONOR_ID',
  })
  donations?: Array<Donation>;
}
