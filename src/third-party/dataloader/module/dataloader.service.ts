import Dataloader from 'dataloader';
import { Injectable, Scope, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import jp from 'jsonpath';

import { JoinProperty, RelationMetadata } from '../types';
import { DataloaderMapper } from '../utils';
import { CacheMapProvider } from './dataloader.module';
import { DataloaderMetadataService } from './dataloader-metadata.service';
import { TestService } from 'src/modules/test/test.service';

interface LoadParams<Parent> {
  from: Type;
  field?: string;
  by: [Parent, ...any];
}

@Injectable({ scope: Scope.REQUEST })
export class DataloaderService {
  private dataloaderMappedByParentField = new Map<Type, Map<string, Dataloader<JoinProperty, any>>>();

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly cacheMapProvider: CacheMapProvider,
    private readonly dataloaderMetadataService: DataloaderMetadataService,
  ) {}

  // todo -> add return types by overloading
  // todo -> add support to get inverse side of a relations automatically if on side is provided
  async load<Parent>(child: Type, params: LoadParams<Parent>) {
    try {
      console.log('=========================');
      console.log(this.moduleRef.get(TestService, { strict: true }));
      console.log('=========================');
    } catch (e) {
      console.log(e);
    }

    const { by, from, field } = params;
    const metadataMap = this.dataloaderMetadataService.getMetadata(from, child);

    if (!metadataMap) {
      throw new Error(`cannot find metadata for ${from.name} -> ${child.name}`);
    }

    if (!field && metadataMap.size > 1) {
      throw new Error(
        `multiple relations found between ${from.name} and ${child.name}, please provide the 'field' field.`,
      );
    }
    const metadata = metadataMap.get(field as string) || (metadataMap.values().next().value as RelationMetadata);
    const [parentData, args = []] = by;
    const [key] = jp.query(parentData, '$.' + metadata.by);
    const dataloader = await this.getOrCreateDataloader(params, metadata, ...args);
    return dataloader.load(key);
  }

  private async getOrCreateDataloader(params: LoadParams<any>, metadata: RelationMetadata, ...args: Array<unknown>) {
    let parentDataloaderMap = this.dataloaderMappedByParentField.get(params.from);
    if (!parentDataloaderMap) {
      parentDataloaderMap = new Map();
      this.dataloaderMappedByParentField.set(params.from, parentDataloaderMap);
    }

    if (parentDataloaderMap?.has(params.field)) {
      return parentDataloaderMap.get(params.field);
    }

    const dataloader = await this.createDataloader(metadata, ...args);
    parentDataloaderMap.set(params.field, dataloader);
    return dataloader;
  }

  private async createDataloader(metadata: RelationMetadata, ...args: Array<unknown>) {
    const provider = this.dataloaderMetadataService.getDataloaderHandler(metadata.on);

    if (!provider) {
      throw new Error(`cannot find provider: ${metadata.on}`);
    }

    const resolvedProvider = this.dataloaderMetadataService.getAlias(provider.provide);

    const repository = this.moduleRef.get(resolvedProvider || provider.provide, { strict: false });

    /**
     * PS: using strict: false allows us to load all providers from the module globally or not
     * using strict: true will only load providers from the current module
     * however, it's not possible to use providers imported from other modules
     * using "import" statement, but it's possible to use providers from other
     * modules using "providers" option in the module registration
     *
     * more tests should be done to check the best approach
     */

    if (!repository) {
      throw new Error(`cannot find provider: ${provider.provide.name}`);
    }

    const fetchRecords = async (keys: Array<JoinProperty>) => {
      return repository[provider.field](keys, ...args) as unknown[];
    };

    const batchFunction = async (keys: Array<JoinProperty>) => {
      const entities = await fetchRecords(keys);
      return DataloaderMapper.map(metadata, keys, entities);
    };

    return new Dataloader<number | string, any>(batchFunction, {
      cache: this.cacheMapProvider?.cache,
      cacheMap: this.cacheMapProvider?.getCacheMap?.(),
    });
  }
}
