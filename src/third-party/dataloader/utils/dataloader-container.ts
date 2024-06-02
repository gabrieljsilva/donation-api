import {
  AdjacencyGraph,
  AliasForReturnFn,
  DataloaderChildFN,
  DataloaderKey,
  LoadFieldMetadata,
  MetadataMappedByKey,
} from '../types';
import { Type } from '@nestjs/common';

export interface DataloaderHandler {
  provide: Type;
  field: string;
}

export class DataloaderContainer {
  private static readonly relations = new AdjacencyGraph<DataloaderChildFN, MetadataMappedByKey>();
  private static readonly aliases = new Map<Type, AliasForReturnFn>();
  private static readonly dataloaderHandlersMappedByKey = new Map<DataloaderKey, DataloaderHandler>();

  static setDataloaderHandler(key: DataloaderKey, provider: DataloaderHandler) {
    if (this.dataloaderHandlersMappedByKey.has(key)) {
      throw new Error(`Dataloader provider with key ${key} already exists`);
    }
    this.dataloaderHandlersMappedByKey.set(key, provider);
  }

  static getDataloaderHandlers() {
    return this.dataloaderHandlersMappedByKey;
  }

  static addRelationMetadata(
    parent: () => Type,
    child: DataloaderChildFN,
    key: DataloaderKey,
    metadata: LoadFieldMetadata,
  ) {
    const relationMetadata = this.getRelationMetadata(parent, child);
    if (relationMetadata) {
      relationMetadata.set(key, metadata);
      return;
    }

    this.relations.addEdge(parent, child, new Map([[key, metadata]]));
  }

  static getRelationMetadata(parent: () => Type, child: DataloaderChildFN): MetadataMappedByKey {
    return this.relations.getEdges(parent)?.get(child);
  }

  static getRelationType(vertex: DataloaderChildFN) {
    const returnType = vertex();
    const isArray = Array.isArray(returnType);
    return isArray ? returnType[0] : returnType;
  }

  static resolveRelations() {
    return this.relations.transform(
      (vertex) => this.getRelationType(vertex),
      (edge, vertex, neighbor) => {
        return edge;
      },
    );
  }

  static hasAlias(alias: Type): boolean {
    return this.aliases.has(alias);
  }

  static setAlias(target: Type, alias: AliasForReturnFn) {
    if (this.hasAlias(target)) {
      throw new Error(`Alias for ${target} already exists`);
    }

    this.aliases.set(target, alias);
  }

  static resolveAliases() {
    const aliases = new Map<Type, Type>();
    for (const [key, aliasReturnFn] of this.aliases.entries()) {
      aliases.set(key, aliasReturnFn() as Type);
    }
    return aliases;
  }
}
