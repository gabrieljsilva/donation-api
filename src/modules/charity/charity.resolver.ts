import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Charity, Document, Donation } from 'src/entities';
import { CharityService } from './charity.service';
import { CreateCharityDto } from './dto';
import { DataloaderService } from 'src/third-party/dataloader/module';

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
    return this.dataloader.load(Donation, { from: Charity, by: [charity] });
  }

  @ResolveField(() => [Document])
  async documents(@Parent() charity: Charity) {
    return this.dataloader.load(Document, { from: Charity, by: [charity] });
  }
}
