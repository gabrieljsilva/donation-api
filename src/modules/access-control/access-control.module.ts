import { Module } from '@nestjs/common';

import { AccessControlResolver } from './access-control.resolver';
import { AccessControlService } from './access-control.service';

@Module({
  imports: [],
  providers: [AccessControlResolver, AccessControlService],
  controllers: [],
  exports: [],
})
export class AccessControlModule {}
