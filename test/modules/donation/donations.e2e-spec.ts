import request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { setupApp } from 'test/setup/setup.app';
import { CreateAccountAndLoginRoutine, GetCurrentAccessRoutine } from 'test/routines/access';
import { CreateCharityRoutine } from 'test/routines/charity';
import { gql } from 'test/constants';

describe('Donations e2e tests', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await setupApp();
    token = await new CreateAccountAndLoginRoutine(app).execute();
  });

  it('should donate successfully', async () => {
    const charity = await new CreateCharityRoutine(app).execute(token);
    const access = await new GetCurrentAccessRoutine(app).execute(token);

    const response = await request(app.getHttpServer())
      .post(gql)
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          mutation Donate($input: DonateDto!) {
              donate(donateDto: $input){
                  id
                  amount
                  charityId
                  donorId
              }
          }
        `,
        variables: {
          input: {
            amount: 15,
            charityId: charity.id,
          },
        },
      });

    expect(response.body).toEqual({
      data: {
        donate: {
          id: expect.any(Number),
          amount: 15,
          charityId: charity.id,
          donorId: access.donor.id,
        },
      },
    });
  });
});
