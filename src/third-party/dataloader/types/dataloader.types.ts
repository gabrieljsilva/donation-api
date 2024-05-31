import { Type } from '@nestjs/common';

export type JoinProperty = string | number;
export type DataloaderKey = string;
export type JoinPropertyFn<Parent> = (parent: Parent) => JoinProperty;
export type DataloaderChild<T> = Type<T> | [Type<T>];
export type DataloaderChildFN<T> = () => DataloaderChild<T>;
export type AliasForReturnFn = () => Type | Function;
