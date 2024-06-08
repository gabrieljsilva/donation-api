import request from 'supertest';
import { Routine } from 'test/domain';

export class CreateAccessRoutine extends Routine {
  private readonly query = `
      mutation CreateAccess($input: CreateAccessDto!) {
          createAccess(input: $input){
              id
              email
          }
      }
  `;

  private readonly variables = {
    input: {
      name: 'John Doe',
      birthDate: '2000-01-01',
      email: 'john.doe@email.com',
      password: '12345678',
    },
  };

  async execute(variables?: any) {
    await request(this.app.getHttpServer())
      .post(this.endpoint)
      .send({
        query: this.query,
        variables: variables || this.variables,
      });

    return {
      email: this.variables.input.email,
      password: this.variables.input.password,
    };
  }
}
