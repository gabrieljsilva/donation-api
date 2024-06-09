import { INestApplication } from '@nestjs/common';
import { setupApp } from 'test/setup/setup.app';
import { CreateAccessRoutine, LoginRoutine } from 'test/routines/access';
import request from 'supertest';
import { gql } from 'test/constants';

describe('Get current access e2e tests', () => {
  let app: INestApplication;
  let token: string;
  let credentials: any;

  beforeAll(async () => {
    app = await setupApp();
    credentials = await new CreateAccessRoutine(app).execute();
    token = await new LoginRoutine(app).execute({ input: credentials });
  });

  it('should get current access successfully', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query GetCurrentAccess {
              getCurrentAccess {
                  id
                  email
              }
          }
        `,
        variables: {},
      });

    expect(response.body).toEqual({
      data: {
        getCurrentAccess: {
          id: expect.any(Number),
          email: credentials.email,
        },
      },
    });
  });

  it('should load donor from access', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query GetCurrentAccess {
              getCurrentAccess {
                  donor {
                    id
                    name
                  }
              }
          }
        `,
        variables: {},
      });

    expect(response.body).toEqual({
      data: {
        getCurrentAccess: {
          donor: {
            id: expect.any(Number),
            name: expect.any(String),
          },
        },
      },
    });
  });
});
