import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAccessDto {
  @Field()
  name: string;

  @Field()
  birthDate: Date;

  @Field()
  email: string;

  @Field()
  password: string;
}
