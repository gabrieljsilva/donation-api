import { DataloaderChildFN, DataloaderKey, InverseJoinPropertyFn, JoinPropertyFn } from './dataloader.types';

interface LoadFieldMetadataConstructor<Parent, Child> {
  key: DataloaderKey;
  child: DataloaderChildFN<Child>;
  joinProperty: JoinPropertyFn<Parent>;
  inverseJoinProperty?: InverseJoinPropertyFn<Child>;
  field: string;
}

export class LoadFieldMetadata<Parent = any, Child = any> implements LoadFieldMetadataConstructor<Parent, Child> {
  key: string;
  child: DataloaderChildFN<Child>;
  joinProperty: JoinPropertyFn<Parent>;
  inverseJoinProperty?: InverseJoinPropertyFn<Child>;
  field: string;

  constructor(constructor: LoadFieldMetadataConstructor<Parent, Child>) {
    this.key = constructor.key;
    this.child = constructor.child;
    this.joinProperty = constructor.joinProperty;
    this.inverseJoinProperty = constructor.inverseJoinProperty;
    this.field = constructor.field;
  }

  get isArray() {
    return Array.isArray(this.child());
  }
}
