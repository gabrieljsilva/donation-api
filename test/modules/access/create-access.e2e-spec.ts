import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { gql } from 'test/constants';
import { setupApp } from 'test/setup/setup.app';

describe('Create access e2e tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupApp();
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
