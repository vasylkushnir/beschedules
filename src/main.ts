import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpLoggingInterceptor } from './interceptors/http-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Schedules API')
    .setDescription('API documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('schedules')
    .build();

  const document = SwaggerModule.createDocument(app, config, {});

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Schedules API',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useLogger(['error', 'warn', 'log']);
  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
  Logger.log(`HTTP server started on :${process.env.PORT}`, 'Bootstrap');
}
bootstrap();
