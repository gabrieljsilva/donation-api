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

/**
 *
 * Atualmente o módulo Dataloader só carrega os DataloaderHandlers globalmente, o que não é o ideal;
 * Deve se pensar em uma forma de carregar os DataloaderHandlers localmente;
 *
 * Proposta: no método register, adicionar um parâmetro que recebe uma lista de módulos para serem importados.
 * Esses módulos devem exportar todos os providers que possuem métodos decorados com @DataloaderHandler.
 * O módulo deve ser capaz de resolver esses providers e adicionar ao DataloaderService.
 */

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
