import Dataloader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { LoadFieldMetadata, JoinProperty } from '../types';
import { DataloaderMapper, DataloaderMetadataContainer } from '../utils';
import { CacheMapProvider } from './dataloader.module';

@Injectable({ scope: Scope.REQUEST })
export class DataloaderService {
  private dataloaderMappedByKey = new Map<string, Dataloader<JoinProperty, any>>();

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly cacheMapProvider: CacheMapProvider,
  ) {}

  async load<Parent, Child>(key: string, parent: Parent, ...params: Array<unknown>): Promise<Array<Child>> {
    const metadata = DataloaderMetadataContainer.getFieldMetadata(key);
    if (!metadata) {
      throw new Error(`cannot find metadata for key: ${key}`);
    }
    const dataloader = await this.getOrCreateDataloader(key, metadata, ...params);
    const joinProperty = metadata.joinProperty(parent);
    return dataloader.load(joinProperty);
  }

  private async getOrCreateDataloader(key: string, metadata: LoadFieldMetadata, ...params: Array<unknown>) {
    if (this.dataloaderMappedByKey.has(key)) {
      return this.dataloaderMappedByKey.get(key);
    }

    const provider = DataloaderMetadataContainer.getProvider(key);
    const resolvedProvider = DataloaderMetadataContainer.getAlias(provider.provide);
    const repository = this.moduleRef.get(resolvedProvider?.() || provider.provide, { strict: false });

    if (!repository) {
      throw new Error(`cannot find provider: ${provider.provide.name}`);
    }

    const fetchRecords = async (keys: Array<JoinProperty>) => {
      return repository[provider.field](keys, ...params) as unknown[];
    };

    const batchFunction = async (keys: Array<JoinProperty>) => {
      const entities = await fetchRecords(keys);
      return DataloaderMapper.map(metadata, keys, entities);
    };

    const dataloader = new Dataloader<number | string, any>(batchFunction, {
      cache: this.cacheMapProvider?.cache,
      cacheMap: this.cacheMapProvider?.getCacheMap?.(),
    });

    this.dataloaderMappedByKey.set(key, dataloader);
    return dataloader;
  }
}
