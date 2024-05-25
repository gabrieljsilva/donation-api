import { DynamicModule, Provider } from '@nestjs/common';
import { CacheMap } from 'dataloader';
import { DataloaderService } from './dataloader.service';

interface DataloaderModuleOptions {
  global?: boolean;
  cache?: boolean;
  getCacheMap?: () => CacheMap<any, any>;
}

export class CacheMapProvider {
  cache: boolean;
  getCacheMap: () => CacheMap<any, any>;
}

export class DataloaderModule {
  static register(options?: DataloaderModuleOptions): DynamicModule {
    const { global = true, getCacheMap, cache = false } = options || {};

    const providers: Provider[] = [
      DataloaderService,
      {
        provide: CacheMapProvider,
        useValue: { getCacheMap, cache },
      },
    ];

    return {
      module: DataloaderModule,
      providers: providers,
      exports: providers,
      global: global,
    };
  }
}
