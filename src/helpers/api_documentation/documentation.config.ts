import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

/**
 * Builds the Swagger document configuration for Taliko.
 */
export const createSwaggerConfig = () => {
  const config = new DocumentBuilder()
    .setTitle('Taliko API')
    .setDescription(
      'Taliko - African Edutainment & Storytelling Universe for Children. Interactive stories, educational games, creative drawing, music, and parental controls.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .setLicense('UNLICENSED', 'https://taliko.app')
    .setContact('Taliko', 'https://taliko.app', 'hello@taliko.app')
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      url: '/docs-json',
      filter: true,
      persistAuthorization: true,
      tagsSorter: 'alpha',
      docExpansion: 'none',
      operationsSorter: (a: any, b: any) => {
        const order = ['get', 'post', 'patch', 'delete'];
        const methodA = a.get('method');
        const methodB = b.get('method');

        if (methodA !== methodB) {
          return order.indexOf(methodA) - order.indexOf(methodB);
        }

        return a.get('path').localeCompare(b.get('path'));
      },
    },
  };

  return { config, customOptions };
};
