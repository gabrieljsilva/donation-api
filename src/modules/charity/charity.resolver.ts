import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Charity, Donation } from '../../entities';
import { CharityService } from './charity.service';
import { CreateCharityDto } from './dto';
import { DataloaderService } from '../../third-party/dataloader/module';

@Resolver(Charity)
export class CharityResolver {
  constructor(
    private readonly charityService: CharityService,
    private readonly dataloader: DataloaderService,
  ) {}

  @Query(() => [Charity])
  async findAllCharities() {
    return this.charityService.findAll();
  }

  @Mutation(() => Charity)
  async createCharity(@Args('createCharityDto') createCharityDto: CreateCharityDto) {
    return this.charityService.createCharity(createCharityDto);
  }

  @ResolveField(() => [Donation])
  async donations(@Parent() charity: Charity) {
    return this.dataloader.load(Donation, { from: Charity, by: [charity], on: 'LOAD_DONATIONS_BY_CHARITY_ID' });
  }
}
