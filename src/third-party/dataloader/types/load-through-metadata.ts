export class LoadThroughMetadata {
  field: string;
  joinProperty: string;

  constructor(metadata: LoadThroughMetadata) {
    this.field = metadata.field;
    this.joinProperty = metadata.joinProperty;
  }
}
