import { Type } from '@nestjs/common';
import { DataloaderChildFN, JoinPropertyFn, LoadFieldMetadata } from '../types';
import { DataloaderMetadataContainer } from '../utils';

interface LoadFieldOptions<Child, Parent> {
  by: JoinPropertyFn<Parent>;
  where: JoinPropertyFn<Child>;
  on: string;
}

export function Load<Child = any, Parent = any>(
  child: DataloaderChildFN<Child>,
  options: LoadFieldOptions<Child, Parent>,
) {
  const { by, where, on } = options;
  return (target: NonNullable<unknown>, propertyKey: string) => {
    const fieldMetadata = new LoadFieldMetadata({
      key: on,
      child: child,
      parent: target.constructor as Type<Parent>,
      joinProperty: by,
      inverseJoinProperty: where,
      field: propertyKey,
    });

    DataloaderMetadataContainer.setFieldMetadata(fieldMetadata);
  };
}
