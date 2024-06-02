import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Charity, Document } from 'src/entities';
import { DataloaderService } from 'src/third-party/dataloader/module';
import { DocumentService } from 'src/modules/document/document.service';

@Resolver(() => Document)
export class DocumentResolver {
  constructor(
    private readonly documentService: DocumentService,
    private readonly dataloader: DataloaderService,
  ) {}

  @Query(() => [Document])
  async findAllDocumentsByCharityId(@Args('charityId', { type: () => Int }) charityId: number) {
    return this.documentService.findAllByCharityId(charityId);
  }

  @ResolveField(() => Charity)
  async charity(@Parent() document: Document) {
    const data = await this.dataloader.load([Charity], {
      from: Document,
      by: [document],
      on: 'LOAD_CHARITIES_BY_DOCUMENTS_IDS',
    });

    return data;
  }
}
