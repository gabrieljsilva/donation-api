import { Field, ObjectType } from '@nestjs/graphql';
import Prisma from '@prisma/client';

import { Access } from './access.entity';
import { LoadField } from '../third-party/dataloader/decorators';
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

  @LoadField(() => Access, (donor) => donor.accessId, (access) => access.id, 'LOAD_ACCESS_BY_ID')
  access?: Access;

  @LoadField(() => [Donation], (donor) => donor.id, (donation) => donation.donorId, 'LOAD_DONATIONS_BY_DONOR_ID')
  donations?: Array<Donation>;
}
