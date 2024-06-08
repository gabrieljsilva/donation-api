import { INestApplication } from '@nestjs/common';
import { CreateAccessRoutine } from 'test/routines/access/create-access.routines';
import { LoginRoutine } from 'test/routines/access/login.routine';
import { Routine } from 'test/domain';

export class CreateAccountAndLoginRoutine extends Routine {
  private readonly createAccountRoutine: CreateAccessRoutine;
  private readonly loginRoutine: LoginRoutine;

  constructor(app: INestApplication) {
    super(app);
    this.createAccountRoutine = new CreateAccessRoutine(app);
    this.loginRoutine = new LoginRoutine(app);
  }

  async execute() {
    const credentials = await this.createAccountRoutine.execute();
    return await this.loginRoutine.execute({ input: credentials });
  }
}
