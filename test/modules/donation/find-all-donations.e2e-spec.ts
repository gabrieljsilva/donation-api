import { CreateAccountAndLoginRoutine, GetCurrentAccessRoutine } from 'test/routines/access';
import request from 'supertest';
import { gql } from 'test/constants';
import { INestApplication } from '@nestjs/common';
import { setupApp } from 'test/setup/setup.app';
import { DonateRoutine } from 'test/routines/donation';
import { CreateCharityRoutine } from 'test/routines/charity';

describe('Donations e2e tests', () => {
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

  it('should find all donations', async () => {
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
          query FindAllDonations {
              findAllDonations {
                  id
                  amount
              }
          }
      `,
        variables: {},
      });

    expect(response.body).toEqual({
      data: {
        findAllDonations: [
          {
            id: expect.any(Number),
            amount: 15,
          },
        ],
      },
    });
  });

  it('should load charity field from donation', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query FindAllDonations {
              findAllDonations {
                  charity {
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
        findAllDonations: [
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

  it('should load donor field from donation', async () => {
    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query FindAllDonations {
              findAllDonations {
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
        findAllDonations: [
          {
            donor: {
              id: access.donor.id,
              name: access.donor.name,
            },
          },
        ],
      },
    });
  });
});
