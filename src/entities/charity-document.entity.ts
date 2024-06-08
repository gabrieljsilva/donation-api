import Prisma from '@prisma/client';

export class CharityDocument implements Prisma.CharityDocument {
  charityId: number;
  documentId: number;
  id: number;
}
