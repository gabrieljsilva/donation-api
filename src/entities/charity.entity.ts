import Prisma from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { Donation } from './donation.entity';
import { LoadField } from '../third-party/dataloader/decorators';

@ObjectType()
export class Charity implements Prisma.Charity {
  @Field()
  id: number;

  @Field()
  name: string;

  @LoadField(
    () => [Donation],
    (charity) => charity.id,
    (donation) => donation.charityId,
    'LOAD_DONATIONS_BY_CHARITY_ID',
  )
  donations?: Array<Donation>;
}
