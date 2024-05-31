import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Donation, Access, Charity, Donor } from '../../entities';
import { DonationService } from './donation.service';
import { CurrentAccess } from '../../decorators';
import { DataloaderService } from '../../third-party/dataloader/module';
import { DonateDto } from './dto';

@Resolver(Donation)
export class DonationResolver {
  constructor(
    private readonly donationService: DonationService,
    private readonly dataloader: DataloaderService,
  ) {}

  @Query(() => [Donation])
  async findAllDonations() {
    return this.donationService.findAll();
  }

  @Mutation(() => Donation)
  async donate(@Args('donateDto') donateDto: DonateDto, @CurrentAccess() access: Access) {
    return this.donationService.donate(donateDto, access);
  }

  @ResolveField(() => Donor)
  async donor(@Parent() donation: Donation) {
    return this.dataloader.load(Donor, { from: Donation, by: [donation], on: 'LOAD_DONOR_BY_ID' });
  }

  @ResolveField(() => Charity)
  async charity(@Parent() donation: Donation) {
    return this.dataloader.load(Charity, { from: Donation, by: [donation], on: 'LOAD_CHARITY_BY_ID' });
  }
}
