import { NestFactory } from '@nestjs/core';
import { SupplierServiceModule } from './supplier-service.module';

async function bootstrap() {
  const app = await NestFactory.create(SupplierServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
