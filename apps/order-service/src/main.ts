import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

import { OrderServiceModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule);

  // Prefijo global
  app.setGlobalPrefix('api');

  // CORS
  // ⚠️ origin: '*' es incompatible con credentials: true (los navegadores
  // rechazan Access-Control-Allow-Origin: * cuando se envían cookies/auth).
  // `origin: true` refleja el origin de la petición, que sí es válido con credentials.
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Order Service')
    .setDescription('API del Order Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI ← faltaba montar el documento generado, si no /api/docs no existe
  //SwaggerModule.setup('api/docs', app, document);

  // Scalar ← fix: spec.content en vez de content directamente
  app.use(
    '/scalar',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port);

  console.log(`🚀 Running on http://localhost:${port}`);
  //console.log(`📘 Swagger: http://localhost:${port}/api/docs`);
  console.log(`✨ Scalar: http://localhost:${port}/scalar`);
}

bootstrap();
