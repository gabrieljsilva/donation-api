import { DataloaderMetadataContainer } from '../utils';
import { DataloaderHandlerMetadata } from 'src/third-party/dataloader/types';

export function DataloaderHandler(key?: string) {
  return function (target: any, propertyKey: string) {
    DataloaderMetadataContainer.setDataloaderHandler(
      key || propertyKey,
      new DataloaderHandlerMetadata(target.constructor, propertyKey),
    );
  };
}
