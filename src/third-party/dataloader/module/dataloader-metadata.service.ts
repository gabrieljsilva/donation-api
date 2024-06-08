import { Injectable, Type } from '@nestjs/common';
import { AdjacencyGraph, DataloaderKey, RelationMetadata } from '../types';
import { DataloaderHandlerMetadata } from '../utils';

@Injectable()
export class DataloaderMetadataService {
  private readonly aliases: Map<Type, Type>;
  private readonly dataloaderHandlersMappedByKey: Map<DataloaderKey, DataloaderHandlerMetadata>;
  private readonly relations: AdjacencyGraph<Type, Map<string, RelationMetadata>>;

  constructor(
    relations: AdjacencyGraph<Type, Map<string, RelationMetadata>>,
    aliases: Map<Type, Type>,
    dataloaderHandlersMappedByKey: Map<DataloaderKey, DataloaderHandlerMetadata>,
  ) {
    this.relations = relations;
    this.aliases = aliases;
    this.dataloaderHandlersMappedByKey = dataloaderHandlersMappedByKey;
  }

  getMetadata(parent: Type, child: Type) {
    return this.relations.getEdges(parent)?.get(child);
  }

  getDataloaderHandler(key: DataloaderKey) {
    return this.dataloaderHandlersMappedByKey.get(key);
  }

  getAlias(type: Type) {
    return this.aliases.get(type);
  }
}
