import Prisma from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { Donor } from './donor.entity';
import { Charity } from './charity.entity';
import { LoadField } from '../third-party/dataloader/decorators';

@ObjectType()
export class Donation implements Prisma.Donation {
  @Field()
  id: number;

  @Field()
  amount: number;

  @Field()
  donorId: number;

  @LoadField(() => Donor, (donation) => donation.donorId, (donor) => donor.id, 'LOAD_DONOR_BY_ID')
  donor?: Donor;

  @Field()
  charityId: number;

  @LoadField(() => Charity, (donation) => donation.charityId, (charity) => charity.id, 'LOAD_CHARITY_BY_ID')
  charity?: Charity;
}
