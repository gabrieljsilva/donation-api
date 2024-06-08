import { Routine } from 'test/domain';
import request from 'supertest';

export class CreateCharityRoutine extends Routine {
  private readonly query = `
    mutation CreateCharity($input: CreateCharityDto!) {
      createCharity(createCharityDto: $input){
          id
          name
          documents {
              id
              document
              type
          }
      }
    }
  `;

  private readonly variables = {
    input: {
      name: 'Amigo Pet',
      CNPJ: '12345678',
    },
  };

  async execute(token: string, variables?: any) {
    const response = await request(this.app.getHttpServer())
      .post(this.endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: this.query,
        variables: variables || this.variables,
      });

    return response.body.data.createCharity;
  }
}
