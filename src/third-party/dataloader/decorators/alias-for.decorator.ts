import { Type } from '@nestjs/common';
import { AliasForReturnFn } from '../types';
import { DataloaderContainer } from '../utils';

export function AliasFor(provider: AliasForReturnFn) {
  return (target: NonNullable<unknown>) => {
    DataloaderContainer.setAlias(target as Type, provider);
  };
}
