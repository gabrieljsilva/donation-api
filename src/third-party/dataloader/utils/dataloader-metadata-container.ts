import {
  AdjacencyGraph,
  AliasForReturnFn,
  DataloaderHandlerMetadata,
  DataloaderKey,
  LoadThroughMetadata,
  RelationField,
  RelationMetadata,
  RelationNodeFn,
} from 'src/third-party/dataloader/types';
import { Type } from '@nestjs/common';

export class DataloaderMetadataContainer {
  private static readonly relations = new AdjacencyGraph<RelationNodeFn, Map<RelationField, RelationMetadata>>();
  private static readonly loadThroughMetadata = new Map<RelationNodeFn, Map<RelationNodeFn, LoadThroughMetadata>>();
  private static readonly aliases = new Map<Type, AliasForReturnFn>();
  private static readonly dataloaderHandlersMappedByKey = new Map<DataloaderKey, DataloaderHandlerMetadata>();

  static AddRelationMetadata<Parent, Child>(
    parent: RelationNodeFn<Parent>,
    child: RelationNodeFn<Child>,
    field: string,
    metadata: RelationMetadata,
  ) {
    let relationMetadata = this.relations.getEdges(parent)?.get(child);
    relationMetadata ||= new Map<RelationField, RelationMetadata>([[field, metadata]]);
    this.relations.addEdge(parent, child, relationMetadata);
  }

  static addLoadThroughMetadata(
    parent: RelationNodeFn,
    joinEntity: RelationNodeFn,
    loadThroughMetadata: LoadThroughMetadata,
  ) {
    this.loadThroughMetadata.set(parent, new Map([[joinEntity, loadThroughMetadata]]));
  }

  static resolveLoadThroughMetadata() {
    const newMap = new Map<Type, Map<Type, LoadThroughMetadata>>();

    this.loadThroughMetadata.forEach((map, parent) => {
      map.forEach((metadata, child) => {
        newMap.set(parent(), new Map([[child(), metadata]]));
      });
    });

    return newMap;
  }

  static resolveRelations() {
    const resolvedRelations = this.relations.transform(
      (vertex) => vertex(),
      (edge) => edge,
    );

    const resolvedLoadThroughMetadata = this.resolveLoadThroughMetadata();

    return resolvedRelations.transform(
      (vertex) => vertex,
      (edge, vertex) => {
        const loadThroughMetadata = resolvedLoadThroughMetadata.get(vertex);
        if (loadThroughMetadata) {
          // Find Metadata by entity field name
          loadThroughMetadata.forEach((value, joinEntity) => {
            const metadata = edge.get(value.field);
            if (metadata) {
              metadata.joinProperty = value.joinProperty;
              metadata.through = joinEntity;
            }
          });
        }

        return edge;
      },
    );
  }

  static setDataloaderHandler(key: DataloaderKey, provider: DataloaderHandlerMetadata) {
    if (this.dataloaderHandlersMappedByKey.has(key)) {
      throw new Error(`Dataloader provider with key ${key} already exists`);
    }
    this.dataloaderHandlersMappedByKey.set(key, provider);
  }

  static getDataloaderHandlers() {
    return this.dataloaderHandlersMappedByKey;
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
