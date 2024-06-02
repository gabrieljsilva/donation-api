import Prisma, { CharityDocument } from '@prisma/client';
import { Field, ObjectType } from '@nestjs/graphql';
import { DOCUMENT_TYPE } from 'src/domain/enum';

@ObjectType()
export class Document implements Prisma.Document {
  @Field()
  id: number;

  @Field()
  document: string;

  @Field()
  type: DOCUMENT_TYPE;

  charityDocument?: Array<CharityDocument>;
}
