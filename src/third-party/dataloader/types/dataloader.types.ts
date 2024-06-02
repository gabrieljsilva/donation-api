import { Type } from '@nestjs/common';
import { LoadFieldMetadata } from './load-field-metadata';

export type JoinProperty = string | number;
export type DataloaderKey = string;
export type JoinPropertyFn<Parent> = (parent: Parent) => JoinProperty;
export type InverseJoinPropertyFn<Child> = (child: Child) => JoinProperty | Array<JoinProperty>;
export type DataloaderChild<T = unknown> = Type<T> | [Type<T>];
export type DataloaderChildFN<T = unknown> = () => DataloaderChild<T>;
export type AliasForReturnFn = () => Type | Function;
export type MetadataMappedByKey = Map<DataloaderKey, LoadFieldMetadata>;
