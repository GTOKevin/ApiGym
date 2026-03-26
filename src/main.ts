import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.enableCors();

  // Global Exception Filter (Clean Architecture Rule 5)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global Validation Pipe (Clean Architecture Rule 6)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );

  // Prefix all routes with /api/v1
  app.setGlobalPrefix('api/v1');

  // Swagger Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Gym Management API')
    .setDescription('The Gym Management API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Configuration Port
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  
  logger.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  logger.log(`📚 Swagger documentation is available at: http://localhost:${port}/api/docs`);
}
bootstrap();

