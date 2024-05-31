import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Access, Donation, Donor } from '../../entities';
import { DonorService } from './donor.service';
import { DataloaderService } from '../../third-party/dataloader/module';

@Resolver(Donor)
export class DonorResolver {
  constructor(
    private readonly donorService: DonorService,
    private readonly dataloader: DataloaderService,
  ) {}

  @Query(() => [Donor])
  async findAllDonors() {
    return this.donorService.findAll();
  }

  @ResolveField(() => Access, { nullable: true })
  async access(@Parent() donor: Donor) {
    return this.dataloader.load(Access, { from: Donor, by: [donor] });
  }

  @ResolveField(() => [Donation])
  async donations(@Parent() donor: Donor) {
    return this.dataloader.load(Donation, { from: Donor, by: [donor], on: 'LOAD_DONATIONS_BY_DONOR_ID' });
  }
}
