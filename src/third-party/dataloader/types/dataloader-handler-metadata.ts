import { Type } from '@nestjs/common';

export class DataloaderHandlerMetadata {
  provide: Type;
  field: string;

  constructor(provider: Type, field: string) {
    this.provide = provider;
    this.field = field;
  }
}
