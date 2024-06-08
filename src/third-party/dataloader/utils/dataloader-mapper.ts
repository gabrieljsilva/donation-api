import { JoinProperty, RelationMetadata } from '../types';
import jp from 'jsonpath';

export class DataloaderMapper {
  static map(metadata: RelationMetadata, keys: Array<JoinProperty>, entities: Array<unknown>) {
    if (metadata.type === 'OneToMany' && metadata.through) {
      return DataloaderMapper.oneToManyThrough(metadata, keys, entities);
    }

    if (metadata.type === 'OneToOne' && metadata.through) {
      return DataloaderMapper.oneToOneThrough(metadata, keys, entities);
    }

    if (metadata.type === 'OneToOne') {
      return DataloaderMapper.oneToOne(metadata, keys, entities);
    }

    return DataloaderMapper.oneToMany(metadata, keys, entities);
  }

  private static oneToMany(metadata: RelationMetadata, keys: Array<JoinProperty>, entities: Array<unknown>) {
    const entitiesMappedByKey = new Map<JoinProperty, Array<any>>();

    for (const entity of entities) {
      const [key] = jp.query(entity, '$.' + metadata.where);
      if (key) {
        if (!entitiesMappedByKey.has(key)) {
          entitiesMappedByKey.set(key, []);
        }
        entitiesMappedByKey.get(key).push(entity);
      }
    }

    return keys.map((key) => entitiesMappedByKey.get(key) || []);
  }

  private static oneToOne(metadata: RelationMetadata, keys: Array<JoinProperty>, entities: Array<unknown>) {
    const entitiesMappedByKey = new Map<JoinProperty, any>();

    for (const entity of entities) {
      const [key] = jp.query(entity, '$.' + metadata.where);
      if (key) {
        entitiesMappedByKey.set(key, entity);
      }
    }

    return keys.map((key) => entitiesMappedByKey.get(key) || null);
  }

  private static oneToManyThrough(metadata: RelationMetadata, keys: Array<JoinProperty>, entities: Array<unknown>) {
    const entitiesMappedByKey = new Map<JoinProperty, Array<any>>();

    for (const entity of entities) {
      const [intermediateEntities] = jp.query(entity, '$.' + metadata.joinProperty);

      for (const intermediateEntity of intermediateEntities) {
        const [key] = jp.query(intermediateEntity, '$.' + metadata.where);
        if (key) {
          if (!entitiesMappedByKey.has(key)) {
            entitiesMappedByKey.set(key, []);
          }
          entitiesMappedByKey.get(key).push(entity);
        }
      }
    }

    return keys.map((key) => entitiesMappedByKey.get(key) || []);
  }

  private static oneToOneThrough(metadata: RelationMetadata, keys: Array<JoinProperty>, entities: Array<unknown>) {
    const entitiesMappedByKey = new Map<JoinProperty, any>();

    for (const entity of entities) {
      const intermediateEntities = entity[metadata.joinProperty];
      for (const intermediateEntity of intermediateEntities) {
        const [key] = jp.query(intermediateEntity, '$.' + metadata.where);
        if (key) {
          entitiesMappedByKey.set(key, entity);
        }
      }
    }

    return keys.map((key) => entitiesMappedByKey.get(key) || null);
  }
}
