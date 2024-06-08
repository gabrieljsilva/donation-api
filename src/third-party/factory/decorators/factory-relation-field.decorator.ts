import { Type } from '@nestjs/common';
import { extendArrayMetadata } from '@nestjs/common/utils/extend-metadata.util';
import { FACTORY_RELATION } from 'src/third-party/factory/constants/metadata-keys.constants';

export interface FactoryRelationMetadata {
  property: string;
  returnTypeFn: () => Type | [Type];
}

export function FactoryRelationField<T = any>(returnValueFN: () => Type<T> | [Type<T>]) {
  return (target: NonNullable<any>, propertyKey: string) => {
    const factoryRelationMetadata: FactoryRelationMetadata = {
      property: propertyKey,
      returnTypeFn: returnValueFN,
    };

    extendArrayMetadata(FACTORY_RELATION, [factoryRelationMetadata], target.constructor);
  };
}
