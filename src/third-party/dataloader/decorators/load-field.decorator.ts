import { Type } from '@nestjs/common';
import { DataloaderChildFN, InverseJoinPropertyFn, JoinPropertyFn, LoadFieldMetadata } from '../types';
import { DataloaderContainer } from '../utils';

interface LoadFieldOptions<Child, Parent> {
  by: JoinPropertyFn<Parent>;
  where: InverseJoinPropertyFn<Child>;
  on: string;
}

export function Load<Child = any, Parent = any>(
  child: DataloaderChildFN<Child>,
  options: LoadFieldOptions<Child, Parent>,
) {
  const { by, where, on } = options;
  return (target: NonNullable<unknown>, propertyKey: string) => {
    const parent = target.constructor as Type<Parent>;
    const fieldMetadata = new LoadFieldMetadata({
      key: on,
      child: child,
      joinProperty: by,
      inverseJoinProperty: where,
      field: propertyKey,
    });

    DataloaderContainer.addRelationMetadata(() => parent, child, on, fieldMetadata);
  };
}
