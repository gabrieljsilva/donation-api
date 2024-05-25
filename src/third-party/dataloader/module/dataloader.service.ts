import * as Dataloader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { LoadFieldMetadata } from '../types';
import { JoinProperty } from '../types/dataloader.types';
import { DataloaderMetadataContainer } from '../utils';
import { RESOLVE_DATALOADER_PROVIDER } from '../constants';
import { CacheMapProvider } from './dataloader.module';

@Injectable({ scope: Scope.REQUEST })
export class DataloaderService {
  private dataloaderMappedByKey = new Map<string, Dataloader<JoinProperty, any>>();

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly cacheMapProvider: CacheMapProvider,
  ) {}

  async load<Parent, Child>(key: string, parent: Parent): Promise<Array<Child>> {
    const metadata = DataloaderMetadataContainer.getFieldMetadata(key);
    if (!metadata) {
      throw new Error(`cannot find metadata for key: ${key}`);
    }
    const dataloader = await this.getOrCreateDataloader(key, metadata);
    const joinProperty = metadata.joinProperty(parent);
    return dataloader.load(joinProperty);
  }

  private async getOrCreateDataloader(key: string, metadata: LoadFieldMetadata) {
    if (this.dataloaderMappedByKey.has(key)) {
      return this.dataloaderMappedByKey.get(key);
    }

    const provider = DataloaderMetadataContainer.getProvider(key);
    const resolvedProvider = Reflect.getMetadata(RESOLVE_DATALOADER_PROVIDER, provider.provide);
    const repository = this.moduleRef.get(resolvedProvider || provider.provide, { strict: false });

    if (!repository) {
      throw new Error(`cannot find provider: ${provider.provide.name}`);
    }

    const loadEntitiesByKeys = async (keys: Array<JoinProperty>) => {
      const entities = await repository[provider.field](keys);
      const entitiesMappedByKey = new Map<JoinProperty, any>();

      for (const key of keys) {
        const entity = entities.find((entity) => metadata.inverseJoinProperty(entity) === key);
        entitiesMappedByKey.set(key, entity);
      }

      return keys.map((key) => entitiesMappedByKey.get(key));
    };

    const dataloader = new Dataloader<number | string, any>(loadEntitiesByKeys, {
      cache: this.cacheMapProvider?.cache,
      cacheMap: this.cacheMapProvider?.getCacheMap?.(),
    });
    this.dataloaderMappedByKey.set(key, dataloader);
    return dataloader;
  }
}
