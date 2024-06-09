import { Routine } from 'test/domain';
import request from 'supertest';
import { gql } from 'test/constants';

export class DonateRoutine extends Routine {
  private readonly query = `
    mutation Donate($input: DonateDto!) {
        donate(donateDto: $input){
            id
            amount
            charityId
            donorId
        }
    }
  `;

  private readonly variables = {
    input: {
      amount: 15,
      charityId: 1,
    },
  };

  async execute(token: string, variables?: any) {
    const response = await request(this.app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: this.query,
        variables: variables || this.variables,
      });

    return response.body.data.donate;
  }
}
