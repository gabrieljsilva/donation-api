import Dataloader from 'dataloader';
import { Injectable, Scope, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { LoadFieldMetadata, JoinProperty, DataloaderChild } from '../types';
import { DataloaderMapper } from '../utils';
import { CacheMapProvider } from './dataloader.module';
import { DataloaderMetadataService } from './dataloader-metadata.service';

interface LoadParams<Parent> {
  from: Type;
  by: [Parent, ...any];
  on?: string;
}

@Injectable({ scope: Scope.REQUEST })
export class DataloaderService {
  private dataloaderMappedByKey = new Map<string, Dataloader<JoinProperty, any>>();

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly cacheMapProvider: CacheMapProvider,
    private readonly dataloaderMetadataService: DataloaderMetadataService,
  ) {}

  async load<Parent, Child>(child: [Type<Child>], params: LoadParams<Parent>): Promise<Array<Array<Child>>>;
  async load<Parent, Child>(child: Type<Child>, params: LoadParams<Parent>): Promise<Child[]>;
  async load<Parent, Child>(
    child: Type<Child> | [Type<Child>],
    params: LoadParams<Parent>,
  ): Promise<Child[] | Child[][]> {
    const childType = Array.isArray(child) ? child[0] : child;
    const metadataMap = this.dataloaderMetadataService.getMetadata(params.from, childType);

    if (!metadataMap) {
      throw new Error(`cannot find metadata for ${parent.name} -> ${params.from.name} `);
    }

    const hasMultipleRelations = metadataMap.size > 1;

    if (hasMultipleRelations && !params.on) {
      throw new Error(
        `multiple relations found between ${params.from.name} and ${childType.name}, please provide the 'on' field.`,
      );
    }

    const metadata: LoadFieldMetadata = hasMultipleRelations
      ? metadataMap.get(params.on)
      : metadataMap.values().next().value;

    const [parentData, args = []] = params.by;
    const dataloader = await this.getOrCreateDataloader(metadata.key, metadata, ...args);
    const joinProperty = metadata.joinProperty(parentData);
    return dataloader.load(joinProperty);
  }

  private async getOrCreateDataloader(key: string, metadata: LoadFieldMetadata, ...params: Array<unknown>) {
    if (this.dataloaderMappedByKey.has(key)) {
      return this.dataloaderMappedByKey.get(key);
    }

    const provider = this.dataloaderMetadataService.getDataloaderHandler(key);
    const resolvedProvider = this.dataloaderMetadataService.getAlias(provider.provide);
    const repository = this.moduleRef.get(resolvedProvider || provider.provide, { strict: false });

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
