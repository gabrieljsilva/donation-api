import { Type } from '@nestjs/common';
import { AliasForReturnFn } from '../types';
import { DataloaderMetadataContainer } from '../utils';

export function AliasFor(provider: AliasForReturnFn) {
  return (target: NonNullable<unknown>) => {
    DataloaderMetadataContainer.setAlias(target as Type, provider);
  };
}
