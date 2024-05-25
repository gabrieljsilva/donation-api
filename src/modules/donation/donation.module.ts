import { Module } from '@nestjs/common';
import { DonationService } from './donation.service';
import { DonationResolver } from './donation.resolver';

@Module({
  imports: [],
  providers: [DonationService, DonationResolver],
  controllers: [],
  exports: [],
})
export class DonationModule {}
