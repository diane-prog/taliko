import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { CircularInterceptor } from './common/interceptors/circular.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CustomValidationPipe } from './common/response/customValidationPipe';
import { ResponseInterceptor } from './common/response/response.interceptor';
import { allSeeder } from './common/seeder/seeders';
import { buildCorsOptions } from './helpers/cors.config';
import { createSwaggerConfig } from './helpers/api_documentation/documentation.config';

/**
 * Boots the Taliko API.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const env = configService.get<string>('app.nodeEnv');
  const port = configService.get<number>('app.port') ?? 3000;

  app.use(helmet());
  app.enableCors(buildCorsOptions(env));
  app.setGlobalPrefix('api/v1', { exclude: ['/', '/ping'] });

  app.useGlobalPipes(new CustomValidationPipe());

  const reflector = app.get(Reflector);
  const logger = app.get(WINSTON_MODULE_PROVIDER);

  app.useGlobalInterceptors(
    new LoggingInterceptor(logger),
    new ResponseInterceptor(),
    new CircularInterceptor(),
    new ClassSerializerInterceptor(reflector),
  );

  // Run startup seeders (Roles, Badges, Sample Content)
  for (const Seeder of allSeeder) {
    try {
      const seeder = app.get(Seeder);
      await seeder.seed();
    } catch (error) {
      console.warn(
        `Seeder ${Seeder.name} skipped or failed:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  const enableSwagger =
    configService.get<boolean>('app.enableSwagger') || env === 'dev';

  if (enableSwagger) {
    const swaggerUsername = configService.get<string>('app.swaggerUsername');
    const swaggerPassword = configService.get<string>('app.swaggerPassword');

    if (swaggerUsername && swaggerPassword && env !== 'dev') {
      app.use(
        ['/docs', '/docs-json'],
        basicAuth({
          challenge: true,
          users: {
            [swaggerUsername]: swaggerPassword,
          },
        }),
      );
    }

    const { config, customOptions } = createSwaggerConfig();
    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup('docs', app, document, customOptions);
  }

  await app.listen(port);

  console.log(`Taliko API is running on http://localhost:${port}`);
  console.log(
    `Swagger documentation available at http://localhost:${port}/docs`,
  );
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack : String(error);
  console.error(`Failed to start Taliko API: ${message}`);
  process.exit(1);
});
