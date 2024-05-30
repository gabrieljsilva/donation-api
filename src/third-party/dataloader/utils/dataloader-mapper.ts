import { JoinProperty, LoadFieldMetadata } from '../types';

export class DataloaderMapper {
  static map(metadata: LoadFieldMetadata, keys: Array<JoinProperty>, entities: Array<unknown>) {
    return metadata.isArray ? this.mapOneToMany(metadata, keys, entities) : this.mapOneToOne(metadata, keys, entities);
  }

  private static mapOneToOne(metadata: LoadFieldMetadata, keys: Array<JoinProperty>, entities: Array<unknown>) {
    const entitiesMappedByKey = new Map<JoinProperty, any>();

    for (const key of keys) {
      const entity = entities.find((entity) => metadata.inverseJoinProperty(entity) === key);
      entitiesMappedByKey.set(key, entity);
    }

    return keys.map((key) => entitiesMappedByKey.get(key));
  }

  private static mapOneToMany(metadata: LoadFieldMetadata, keys: Array<JoinProperty>, entities: Array<unknown>) {
    const entitiesMappedByKey = new Map<JoinProperty, Array<any>>();

    for (const entity of entities) {
      const key = metadata.inverseJoinProperty(entity);
      if (!entitiesMappedByKey.has(key)) {
        entitiesMappedByKey.set(key, []);
      }
      entitiesMappedByKey.get(key).push(entity);
    }

    return keys.map((key) => entitiesMappedByKey.get(key) || []);
  }
}
