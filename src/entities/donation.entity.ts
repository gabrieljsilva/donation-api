import Prisma from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { Donor } from './donor.entity';
import { Charity } from './charity.entity';
import { Load } from '../third-party/dataloader/decorators';
import { Relation } from '../third-party/dataloader/types';

@ObjectType()
export class Donation implements Prisma.Donation {
  @Field()
  id: number;

  @Field()
  amount: number;

  @Field()
  donorId: number;

  @Load(() => Donor, { by: (donation) => donation.donorId, where: (donor) => donor.id, on: 'LOAD_DONOR_BY_ID' })
  donor?: Relation<Donor>;

  @Field()
  charityId: number;

  @Load(() => Charity, {
    by: (donation) => donation.charityId,
    where: (charity) => charity.id,
    on: 'LOAD_CHARITY_BY_ID',
  })
  charity?: Charity;
}
