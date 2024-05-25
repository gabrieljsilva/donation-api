import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCharityDto {
  @Field()
  name: string;
}
