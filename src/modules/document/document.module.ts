import { Module } from '@nestjs/common';
import { DocumentResolver } from 'src/modules/document/document.resolver';
import { DocumentService } from 'src/modules/document/document.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DocumentResolver, DocumentService],
  exports: [],
})
export class DocumentModule {}
