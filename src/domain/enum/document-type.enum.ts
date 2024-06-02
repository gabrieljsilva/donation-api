import { registerEnumType } from '@nestjs/graphql';
import { DOCUMENT_TYPE } from '@prisma/client';
export { DOCUMENT_TYPE } from '@prisma/client';

registerEnumType(DOCUMENT_TYPE, { name: 'DOCUMENT_TYPE' });
