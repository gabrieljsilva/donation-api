import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from 'src/app.module';

const gql = '/graphql';

describe('Access e2e tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should create access successfully', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .send({
        query: `
        mutation CreateAccess($input: CreateAccessDto!) {
            createAccess(input: $input){
                id
                email
                donor {
                    id
                    name
                    accessId
                }
            }
        }
      `,
        variables: {
          input: {
            name: 'John Doe',
            birthDate: '2000-01-01',
            email: 'john.doe@email.com',
            password: '12345678',
          },
        },
      });

    expect(response.body.data).toEqual({
      createAccess: {
        id: 1,
        email: 'john.doe@email.com',
        donor: { id: 1, name: 'John Doe', accessId: 1 },
      },
    });
  });
});
