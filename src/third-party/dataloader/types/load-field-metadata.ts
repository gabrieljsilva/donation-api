import { DataloaderChildFN, DataloaderKey, JoinPropertyFn } from './dataloader.types';
import { Type } from '@nestjs/common';

interface LoadFieldMetadataConstructor<Parent, Child> {
  key: DataloaderKey;
  parent: Type<Parent>;
  child: DataloaderChildFN<Child>;
  joinProperty: JoinPropertyFn<Parent>;
  inverseJoinProperty?: JoinPropertyFn<Child>;
  field: string;
}

export class LoadFieldMetadata<Parent = any, Child = any> implements LoadFieldMetadataConstructor<Parent, Child> {
  key: string;
  parent: Type<Parent>;
  child: DataloaderChildFN<Child>;
  joinProperty: JoinPropertyFn<Parent>;
  inverseJoinProperty?: JoinPropertyFn<Child>;
  field: string;

  constructor(constructor: LoadFieldMetadataConstructor<Parent, Child>) {
    this.key = constructor.key;
    this.parent = constructor.parent;
    this.child = constructor.child;
    this.joinProperty = constructor.joinProperty;
    this.inverseJoinProperty = constructor.inverseJoinProperty;
    this.field = constructor.field;
  }

  get isArray() {
    return Array.isArray(this.child());
  }
}
