import { Type } from '@nestjs/common';
import { LoadFieldMetadata, DataloaderKey } from '../types';

interface DataloaderProvider {
  provide: Type;
  field: string;
}

export class DataloaderMetadataContainer {
  private static metadata: Map<DataloaderKey, LoadFieldMetadata> = new Map();
  private static providers = new Map<DataloaderKey, DataloaderProvider>();

  static setProvider(key: DataloaderKey, provider: DataloaderProvider) {
    if (this.providers.has(key)) {
      throw new Error(`Provider with key ${key} already exists`);
    }

    this.providers.set(key, provider);
  }

  static hasProvider(key: DataloaderKey): boolean {
    return this.providers.has(key);
  }

  static getProvider(key: DataloaderKey) {
    return this.providers.get(key);
  }

  static setFieldMetadata(metadata: LoadFieldMetadata) {
    if (this.metadata.has(metadata.key)) {
      throw new Error(`Metadata with key ${metadata.key} already exists`);
    }

    this.metadata.set(metadata.key, metadata);
  }

  static hasFieldMetadata(key: string): boolean {
    return this.metadata.has(key);
  }

  static getFieldMetadata(key: string): LoadFieldMetadata {
    return this.metadata.get(key);
  }
}
