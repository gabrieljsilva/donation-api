import { Type } from '@nestjs/common';

export type JoinProperty = string | number;
export type JoinPropertyFn<Parent> = (parent: Parent) => JoinProperty;
export type DataloaderKey = string;
export type DataloaderChildFN<T> = () => Type<T> | [Type<T>];
export type AliasForReturnFn = () => Type | Function;
