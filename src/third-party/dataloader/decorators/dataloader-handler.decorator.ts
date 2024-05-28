import { DataloaderMetadataContainer } from '../utils';

export function DataloaderHandler(key: string) {
  return function (target: any, propertyKey: string) {
    DataloaderMetadataContainer.setProvider(key, {
      provide: target.constructor,
      field: propertyKey,
    });
  };
}
