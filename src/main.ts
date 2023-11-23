import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'dev') {
    app.enableCors();
  }
  const config = new DocumentBuilder()
    .setTitle('CRM API')
    .setDescription('La liste des routes du CRM')
    .setVersion('1.0')
    .addTag('CRM')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: { target: false },
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.getHttpAdapter();
  await app.listen(3000);
}
bootstrap();
