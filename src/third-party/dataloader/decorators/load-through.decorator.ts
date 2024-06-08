import { LoadThroughMetadata, RelationNodeFn } from 'src/third-party/dataloader/types';
import { DataloaderMetadataContainer } from 'src/third-party/dataloader/utils';
import { Type } from '@nestjs/common';

export interface LoadThroughOptions {
  joinEntity: string;
}

export function LoadThrough(joinEntity: RelationNodeFn, options: LoadThroughOptions) {
  return function (target: NonNullable<any>, propertyKey: string) {
    const parent = target.constructor as Type;
    DataloaderMetadataContainer.addLoadThroughMetadata(
      () => parent,
      joinEntity,
      new LoadThroughMetadata({
        field: propertyKey,
        joinProperty: options.joinEntity,
      }),
    );
  };
}
