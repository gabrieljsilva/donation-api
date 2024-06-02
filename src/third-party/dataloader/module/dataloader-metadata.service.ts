import { Injectable, Type } from '@nestjs/common';
import { AdjacencyGraph, DataloaderKey, MetadataMappedByKey } from '../types';
import { DataloaderHandler } from '../utils';

@Injectable()
export class DataloaderMetadataService {
  private readonly relations: AdjacencyGraph<Type, MetadataMappedByKey>;
  private readonly aliases: Map<Type, Type>;
  private readonly dataloaderHandlersMappedByKey: Map<DataloaderKey, DataloaderHandler>;

  constructor(
    relations: AdjacencyGraph<Type, MetadataMappedByKey>,
    aliases: Map<Type, Type>,
    dataloaderHandlersMappedByKey: Map<DataloaderKey, DataloaderHandler>,
  ) {
    this.relations = relations;
    this.aliases = aliases;
    this.dataloaderHandlersMappedByKey = dataloaderHandlersMappedByKey;
  }

  getDataloaderHandler(key: DataloaderKey) {
    return this.dataloaderHandlersMappedByKey.get(key);
  }

  getMetadata(parent: Type, child: Type) {
    return this.relations.getEdges(parent)?.get(child);
  }

  getAlias(type: Type) {
    return this.aliases.get(type);
  }
}
