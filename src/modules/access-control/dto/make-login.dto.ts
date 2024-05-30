import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MakeLoginDto {
  @Field()
  email: string;

  @Field()
  password: string;
}
