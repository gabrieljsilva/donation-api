import { join } from 'node:path';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ClsModule } from 'nestjs-cls';
import { JwtModule } from '@nestjs/jwt';
import { LRUMap } from 'lru_map';

import { AccessControlModule } from './modules/access-control';
import { PrismaModule } from './infra/database';
import { AuthGuard } from './guards';
import { RepositoryModule } from './modules/repository';
import { DataloaderModule } from './third-party/dataloader/module';
import { DonorModule } from './modules/donor/donor.module';
import { CharityModule } from './modules/charity/charity.module';
import { DonationModule } from './modules/donation/donation.module';
import { formatError } from './utils/graphql/format-graphql-errors';
import { DocumentModule } from 'src/modules/document/document.module';
import { TestModule } from 'src/modules/test/test.module';
import { TestService } from 'src/modules/test/test.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: formatError,
    }),
    JwtModule.register({
      secret: 'MySecretKey',
      global: true,
    }),
    ClsModule.forRoot({
      global: true,
    }),
    RepositoryModule.register(),
    DataloaderModule.register({
      global: true,
      cache: true,
      getCacheMap: () => new LRUMap(100),
    }),
    PrismaModule,
    AccessControlModule,
    DonorModule,
    CharityModule,
    DonationModule,
    DocumentModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
