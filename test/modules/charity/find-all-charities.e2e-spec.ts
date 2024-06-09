import request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { CreateAccountAndLoginRoutine, GetCurrentAccessRoutine } from 'test/routines/access';
import { beforeAll } from 'vitest';
import { setupApp } from 'test/setup/setup.app';
import { gql } from 'test/constants';
import { CreateCharityRoutine } from 'test/routines/charity';
import { DonateRoutine } from 'test/routines/donation';

describe('Create charity e2e tests', () => {
  let app: INestApplication;
  let token: string;
  let charity: any;
  let access: any;

  beforeAll(async () => {
    app = await setupApp();
    token = await new CreateAccountAndLoginRoutine(app).execute();
    charity = await new CreateCharityRoutine(app).execute(token);
    access = await new GetCurrentAccessRoutine(app).execute(token);
  });

  it('should find all charities', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query FindAllCharities {
              findAllCharities {
                  id
                  name
              }
          }
      `,
        variable: {},
      });

    expect(response.body).toEqual({
      data: {
        findAllCharities: [
          {
            id: charity.id,
            name: charity.name,
          },
        ],
      },
    });
  });

  it('should load all donations', async () => {
    const donation = await new DonateRoutine(app).execute(token, {
      input: {
        amount: 15,
        charityId: charity.id,
      },
    });

    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query FindAllCharities {
              findAllCharities {
                  donations {
                    id
                    amount
                    donorId
                    charityId
                  }
              }
          }
      `,
        variable: {},
      });

    expect(response.body).toEqual({
      data: {
        findAllCharities: [
          {
            donations: [
              {
                id: expect.any(Number),
                amount: donation.amount,
                charityId: charity.id,
                donorId: access.donor.id,
              },
            ],
          },
        ],
      },
    });
  });

  it('should load all documents', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query FindAllCharities {
              findAllCharities {
                documents {
                    id
                    type
                    document
                }
              }
          }
      `,
        variable: {},
      });

    expect(response.body).toEqual({
      data: {
        findAllCharities: [
          {
            documents: [
              {
                id: expect.any(Number),
                type: charity.documents[0].type,
                document: charity.documents[0].document,
              },
            ],
          },
        ],
      },
    });
  });
});
