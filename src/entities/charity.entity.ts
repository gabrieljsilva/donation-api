import Prisma from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { Donation } from './donation.entity';

@ObjectType()
export class Charity implements Prisma.Charity {
  @Field()
  id: number;

  @Field()
  name: string;

  donations?: Array<Donation>;
}
