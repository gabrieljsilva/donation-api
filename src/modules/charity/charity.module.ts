import { Module } from '@nestjs/common';
import { CharityService } from './charity.service';
import { CharityResolver } from './charity.resolver';

@Module({
  imports: [],
  providers: [CharityService, CharityResolver],
  controllers: [],
  exports: [],
})
export class CharityModule {}
