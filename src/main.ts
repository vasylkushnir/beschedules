import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
      whitelist: true, // викидає зайві поля
      forbidNonWhitelisted: true, // 400 якщо є зайві поля
      transform: true, // перетворює типи (query/params/body)
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  //await app.listen(process.env.PORT ?? 3000);
  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
}
bootstrap();
