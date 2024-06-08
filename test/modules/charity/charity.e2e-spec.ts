import request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { CreateAccountAndLoginRoutine } from 'test/routines/access';
import { beforeAll } from 'vitest';
import { setupApp } from 'test/setup/setup.app';

const gql = '/graphql';

describe('Charity e2e tests', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await setupApp();
    token = await new CreateAccountAndLoginRoutine(app).execute();
  });

  it('should create charity successfully', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
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
      `,
        variables: {
          input: {
            name: 'Amigo Pet',
            CNPJ: '12345678',
          },
        },
      });

    expect(response.body).toEqual({
      data: {
        createCharity: {
          id: 1,
          name: 'Amigo Pet',
          documents: [
            {
              id: 1,
              document: '12345678',
              type: 'CNPJ',
            },
          ],
        },
      },
    });
  });
});
