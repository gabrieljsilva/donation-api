import { JoinProperty, LoadFieldMetadata } from '../types';

export class DataloaderMapper {
  static map(metadata: LoadFieldMetadata, keys: Array<JoinProperty>, entities: Array<unknown>) {
    return metadata.isArray ? this.mapOneToMany(metadata, keys, entities) : this.mapOneToOne(metadata, keys, entities);
  }

  private static mapOneToOne(metadata: LoadFieldMetadata, keys: Array<JoinProperty>, entities: Array<unknown>) {
    const entitiesMappedByKey = new Map<JoinProperty, any>();

    for (const key of keys) {
      const entity = entities.find((entity) => {
        const inverseKeyOrKeys = metadata.inverseJoinProperty(entity);

        if (Array.isArray(inverseKeyOrKeys)) {
          return inverseKeyOrKeys.includes(key);
        }

        return inverseKeyOrKeys === key;
      });

      entitiesMappedByKey.set(key, entity);
    }

    return keys.map((key) => entitiesMappedByKey.get(key));
  }

  // This method actually loads OneToMany and ManyToMany relationships
  // Split it into two methods, one for OneToMany and one for ManyToMany
  // Find a way to identify when keys is an array
  // when keys is an array, call mapOneToMany
  // and when keys is array of arrays, call mapManyToMany
  private static mapOneToMany(metadata: LoadFieldMetadata, keys: Array<JoinProperty>, entities: Array<unknown>) {
    const entitiesMappedByKey = new Map<JoinProperty, Array<any>>();

    for (const entity of entities) {
      const keyOrKeys = metadata.inverseJoinProperty(entity);

      // Loads Many-To-Many Relationships
      if (Array.isArray(keyOrKeys)) {
        for (const key of keyOrKeys) {
          if (!entitiesMappedByKey.has(key)) {
            entitiesMappedByKey.set(key, []);
          }
          entitiesMappedByKey.get(key).push(entity);
        }
        continue;
      }

      // Loads One-To-Many Relationships
      const key = keyOrKeys;
      if (!entitiesMappedByKey.has(key)) {
        entitiesMappedByKey.set(key, []);
      }
      entitiesMappedByKey.get(key).push(entity);
    }

    return keys.map((key) => entitiesMappedByKey.get(key) || []);
  }
}
