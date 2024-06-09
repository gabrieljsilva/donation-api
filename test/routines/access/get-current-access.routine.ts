import { Routine } from 'test/domain';
import request from 'supertest';

export class GetCurrentAccessRoutine extends Routine {
  private readonly query = `
    query GetCurrentAccess {
      getCurrentAccess {
          id
          email
          donor {
            id
            name
            birthDate
          }
      }
    }
  `;

  async execute(token: string) {
    const response = await request(this.app.getHttpServer())
      .post(this.endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({ query: this.query });

    return response.body.data.getCurrentAccess;
  }
}
