import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Access, Donor } from '../../entities';
import { CreateAccessDto, MakeLoginDto } from './dto';
import { AccessControlService } from './access-control.service';
import { CurrentAccess, Public } from '../../decorators';
import { DataloaderService } from '../../third-party/dataloader/module';

@Resolver(Access)
export class AccessControlResolver {
  constructor(
    private readonly accessControlService: AccessControlService,
    private readonly dataloader: DataloaderService,
  ) {}

  @Query(() => Access)
  async getCurrentAccess(@CurrentAccess() access: Access) {
    return access;
  }

  @Public()
  @Mutation(() => String)
  async makeLogin(@Args('input') makeLoginDto: MakeLoginDto) {
    return this.accessControlService.login(makeLoginDto);
  }

  @Public()
  @Mutation(() => Access)
  async createAccess(@Args('input') createAccessDto: CreateAccessDto) {
    return this.accessControlService.createAccess(createAccessDto);
  }

  @Query(() => [Access])
  async findAllAccesses() {
    return this.accessControlService.findAll();
  }

  @ResolveField(() => Donor, { nullable: true })
  async donor(@Parent() access: Access) {
    return this.dataloader.load('LOAD_DONOR_BY_ACCESS_ID', access);
  }
}
