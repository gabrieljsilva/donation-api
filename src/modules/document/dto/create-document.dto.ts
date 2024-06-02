import { Field, InputType } from '@nestjs/graphql';
import { DOCUMENT_TYPE } from 'src/domain/enum';

@InputType()
export class CreateDocumentDto {
  @Field()
  type: DOCUMENT_TYPE;

  @Field()
  document: string;
}
