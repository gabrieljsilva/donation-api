import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class OffsetPagination {
  @Field(() => Int)
  offset: number;

  @Field(() => Int)
  limit: number;
}
