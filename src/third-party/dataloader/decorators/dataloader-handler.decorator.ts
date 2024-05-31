import { DataloaderContainer } from '../utils';

export function DataloaderHandler(key: string) {
  return function (target: any, propertyKey: string) {
    DataloaderContainer.setDataloaderHandler(key, {
      provide: target.constructor,
      field: propertyKey,
    });
  };
}
