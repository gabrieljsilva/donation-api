import { DataloaderMetadataContainer } from '../utils';
import { Type } from '@nestjs/common';
import { AliasForReturnFn } from '../types';

export function AliasFor(provider: AliasForReturnFn) {
  return (target: NonNullable<unknown>) => {
    DataloaderMetadataContainer.setAlias(target as Type, provider);
  };
}
