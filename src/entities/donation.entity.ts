import Prisma from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { Donor } from './donor.entity';
import { Charity } from './charity.entity';
import { LoadOne } from '../third-party/dataloader/decorators';
import { Relation } from '../third-party/dataloader/types';
import { LOAD_CHARITIES_BY_IDS, LOAD_DONORS_BY_IDS } from 'src/constants';

@ObjectType()
export class Donation implements Prisma.Donation {
  @Field()
  id: number;

  @Field()
  amount: number;

  @Field()
  donorId: number;

  @LoadOne<Donor, Donation>(() => Donor, { by: 'donorId', where: 'id', on: LOAD_DONORS_BY_IDS })
  donor?: Relation<Donor>;

  @Field()
  charityId: number;

  @LoadOne<Charity, Donation>(() => Charity, { by: 'charityId', where: 'id', on: LOAD_CHARITIES_BY_IDS })
  charity?: Charity;
}
