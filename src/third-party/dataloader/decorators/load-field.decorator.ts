import { Type } from '@nestjs/common';
import { DataloaderChildFN, JoinPropertyFn, LoadFieldMetadata } from '../types';
import { DataloaderMetadataContainer } from '../utils';

export function LoadField<Child = any, Parent = any>(
  child: DataloaderChildFN<Child>,
  joinProperty: JoinPropertyFn<Parent>,
  inverseJoinProperty: JoinPropertyFn<Child>,
  key: string,
) {
  return (target: NonNullable<unknown>, propertyKey: string) => {
    const fieldMetadata = new LoadFieldMetadata({
      key: key,
      child: child,
      parent: target.constructor as Type<Parent>,
      joinProperty: joinProperty,
      inverseJoinProperty: inverseJoinProperty,
      field: propertyKey,
    });

    DataloaderMetadataContainer.setFieldMetadata(fieldMetadata);
  };
}
