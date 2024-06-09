import { beforeAll, describe } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { setupApp } from 'test/setup/setup.app';
import { CreateAccountAndLoginRoutine } from 'test/routines/access';
import { CreateCharityRoutine } from 'test/routines/charity';
import request from 'supertest';
import { gql } from 'test/constants';

describe('Find documents by charity id e2e tests', () => {
  let app: INestApplication;
  let token: string;
  let charity: any;

  beforeAll(async () => {
    app = await setupApp();
    token = await new CreateAccountAndLoginRoutine(app).execute();
    charity = await new CreateCharityRoutine(app).execute(token);
  });

  it('should load all documents of a given charity by id', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
        query FindAllDocumentsByCharityId($charityId: Int!) {
            findAllDocumentsByCharityId(charityId: $charityId){
                id
                type
                document
            }
        }
      `,
        variables: {
          charityId: charity.id,
        },
      });

    expect(response.body).toEqual({
      data: {
        findAllDocumentsByCharityId: [
          {
            id: expect.any(Number),
            type: charity.documents[0].type,
            document: charity.documents[0].document,
          },
        ],
      },
    });
  });

  it('should load charity of a document', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
        query FindAllDocumentsByCharityId($charityId: Int!) {
            findAllDocumentsByCharityId(charityId: $charityId){
                charity {
                  id
                  name
                }
            }
        }
      `,
        variables: {
          charityId: charity.id,
        },
      });

    expect(response.body).toEqual({
      data: {
        findAllDocumentsByCharityId: [
          {
            charity: {
              id: charity.id,
              name: charity.name,
            },
          },
        ],
      },
    });
  });
});
