import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DonateDto {
  @Field()
  amount: number;

  @Field()
  charityId: number;
}
