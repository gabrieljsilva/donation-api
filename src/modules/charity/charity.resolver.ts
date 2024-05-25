import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Charity } from '../../entities';
import { CharityService } from './charity.service';
import { CreateCharityDto } from './dto';

@Resolver(Charity)
export class CharityResolver {
  constructor(private readonly charityService: CharityService) {}

  @Query(() => [Charity])
  async findAllCharities() {
    return this.charityService.findAll();
  }

  @Mutation(() => Charity)
  async createCharity(@Args('createCharityDto') createCharityDto: CreateCharityDto) {
    return this.charityService.createCharity(createCharityDto);
  }
}
