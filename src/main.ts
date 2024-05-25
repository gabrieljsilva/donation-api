import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Type } from '@nestjs/common';
import { NestedMap } from './domain/data-structures';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}

bootstrap();

// /* Modelagem do container de metadatados para acesso O(1) */
//
// type Key = string;
// class DataloaderFieldMetadata {
//   fieldName: string;
//   parent: Type;
//   key: Key;
//   typeFN: () => Type;
//   joinProperty: number | string;
//   inverseJoinProperty: number | string;
// }
//
// class DataloaderHandlerMetadata {
//   fieldName: string;
//   parent: Type;
//   key: Key;
// }
//
// class DataloaderMetadataStorage {
//   static dataloaderHandlerMappedByKey: Map<string, DataloaderHandlerMetadata> = new Map();
//   static dataloaderFieldMappedByTypeAndKey = new NestedMap<DataloaderFieldMetadata, Type, Key>();
//
//   static addDataloaderHandlerMetadata(metadata: DataloaderHandlerMetadata) {
//     this.dataloaderHandlerMappedByKey.set(metadata.key, metadata);
//   }
//
//   static addDataloaderFieldMetadata(metadata: DataloaderFieldMetadata) {
//     this.dataloaderFieldMappedByTypeAndKey.set(metadata.parent, metadata.key, metadata);
//   }
// }
