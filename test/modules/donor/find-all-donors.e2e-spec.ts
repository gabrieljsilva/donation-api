import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { setupApp } from 'test/setup/setup.app';
import { CreateAccountAndLoginRoutine, GetCurrentAccessRoutine } from 'test/routines/access';
import { CreateCharityRoutine } from 'test/routines/charity';
import { gql } from 'test/constants';
import { DonateRoutine } from 'test/routines/donation';

describe('Find all donors e2e tests', () => {
  let app: INestApplication;
  let token: string;
  let access: any;
  let charity: any;

  beforeAll(async () => {
    app = await setupApp();
    token = await new CreateAccountAndLoginRoutine(app).execute();
    access = await new GetCurrentAccessRoutine(app).execute(token);
    charity = await new CreateCharityRoutine(app).execute(token);
  });

  it('should find all donors', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query FindAllDonors {
              findAllDonors {
                  id
                  name
                  birthDate
              }
          }
        `,
        variables: {},
      });

    expect(response.body).toEqual({
      data: {
        findAllDonors: [
          {
            id: access.donor.id,
            name: access.donor.name,
            birthDate: access.donor.birthDate,
          },
        ],
      },
    });
  });

  it('should load access by donor', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query FindAllDonors {
              findAllDonors {
                  access {
                    id
                    email
                  }
              }
          }
        `,
        variables: {},
      });

    expect(response.body).toEqual({
      data: {
        findAllDonors: [
          {
            access: {
              id: access.id,
              email: access.email,
            },
          },
        ],
      },
    });
  });

  it('should load donations by donor', async () => {
    await new DonateRoutine(app).execute(token, {
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
          query FindAllDonors {
              findAllDonors {
                  donations {
                    id
                    amount
                    charityId
                    donorId
                  }
              }
          }
        `,
        variables: {},
      });

    expect(response.body).toEqual({
      data: {
        findAllDonors: [
          {
            donations: [
              {
                id: expect.any(Number),
                amount: 15,
                charityId: charity.id,
                donorId: access.donor.id,
              },
            ],
          },
        ],
      },
    });
  });
});
