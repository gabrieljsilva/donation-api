import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

export async function setupApp() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();
  await app.init();
  return app;
}
