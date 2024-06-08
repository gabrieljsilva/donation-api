import { INestApplication } from '@nestjs/common';

export abstract class Routine {
  protected readonly app: INestApplication;
  protected readonly endpoint = '/graphql';

  public constructor(app: INestApplication) {
    this.app = app;
  }
}
