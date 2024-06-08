import request from 'supertest';
import { Routine } from 'test/domain';

export class LoginRoutine extends Routine {
  private readonly query = `
      mutation MakeLogin($input: MakeLoginDto!) {
          token: makeLogin(input: $input)
      }
  `;

  private readonly variables = {
    input: {
      email: 'john.doe@email.com',
      password: '12345678',
    },
  };

  async execute(variables?: any) {
    const response = await request(this.app.getHttpServer())
      .post(this.endpoint)
      .send({
        query: this.query,
        variables: variables || this.variables,
      });

    return response.body.data.token;
  }
}
