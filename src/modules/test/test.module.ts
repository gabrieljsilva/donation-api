import { Module } from '@nestjs/common';
import { TestService } from 'src/modules/test/test.service';

@Module({
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
