import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GLOBAL_PREFIX } from '../constants';
import { CoreConfig } from '../core/config';

export function swaggerSetup(app: INestApplication, coreConfig: CoreConfig) {
  if (!coreConfig.IS_SWAGGER_ENABLED) return;

  const config = new DocumentBuilder()
    .setTitle('BLOGGER API')
    .addBasicAuth()
    .addBearerAuth({
      type: 'http',
      description: 'Enter JWT Bearer token only',
    })
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(GLOBAL_PREFIX, app, document, {
    customSiteTitle: 'Blogger Swagger',
    swaggerOptions: {
      operationsSorter: function (a, b) {
        const order = {
          get: '0',
          post: '1',
          patch: '2',
          put: '3',
          delete: '4',
          head: '5',
          options: '6',
          connect: '7',
          trace: '8',
        };
        return (
          order[a.get('method')].localeCompare(order[b.get('method')]) ||
          a.get('path').localeCompare(b.get('path'))
        );
      },
    },
  });
}
