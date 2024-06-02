import { DynamicModule, Provider } from '@nestjs/common';
import {
  AccessRepository,
  CharityRepository,
  DocumentRepository,
  DonationRepository,
  DonorRepository,
} from '../../domain/repositories';
import {
  AccessPrismaRepository,
  DonorPrismaRepository,
  CharityPrismaRepository,
  DonationPrismaRepository,
  DocumentPrismaRepository,
} from '../../repositories';

export class RepositoryModule {
  static register(): DynamicModule {
    const providers: Provider[] = [
      {
        provide: AccessRepository,
        useClass: AccessPrismaRepository,
      },
      {
        provide: DonorRepository,
        useClass: DonorPrismaRepository,
      },
      {
        provide: CharityRepository,
        useClass: CharityPrismaRepository,
      },
      {
        provide: DonationRepository,
        useClass: DonationPrismaRepository,
      },
      {
        provide: DocumentRepository,
        useClass: DocumentPrismaRepository,
      },
    ];

    return {
      global: true,
      module: RepositoryModule,
      providers: providers,
      exports: providers,
    };
  }
}
