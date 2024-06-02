import { Document } from 'src/entities';

export abstract class DocumentRepository {
  abstract findAllByCharitiesIds(charitiesIds: Array<number>): Promise<Array<Document>>;
  abstract findAllByCharityId(charityId: number): Promise<Array<Document>>;
}
