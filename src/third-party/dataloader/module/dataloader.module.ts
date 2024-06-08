import { DynamicModule, Provider } from '@nestjs/common';
import { CacheMap } from 'dataloader';
import { DataloaderService } from './dataloader.service';
import { DataloaderMetadataService } from './dataloader-metadata.service';
import { DataloaderMetadataContainer } from 'src/third-party/dataloader/utils';

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

    const aliases = DataloaderMetadataContainer.resolveAliases();
    const dataloaderHandlers = DataloaderMetadataContainer.getDataloaderHandlers();
    const relations = DataloaderMetadataContainer.resolveRelations();

    const providers: Provider[] = [
      {
        provide: DataloaderService,
        useClass: DataloaderService,
      },
      {
        provide: CacheMapProvider,
        useValue: { getCacheMap, cache },
      },
      {
        provide: DataloaderMetadataService,
        useValue: new DataloaderMetadataService(relations, aliases, dataloaderHandlers),
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
