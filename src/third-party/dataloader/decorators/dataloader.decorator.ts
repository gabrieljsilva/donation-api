import { DataloaderMetadataContainer } from '../utils';

export function Dataloader(key: string) {
  return function (target: any, propertyKey: string) {
    DataloaderMetadataContainer.setProvider(key, {
      provide: target.constructor,
      field: propertyKey,
    });
  };
}
