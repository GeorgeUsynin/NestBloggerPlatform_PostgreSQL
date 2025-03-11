import { NestFactory } from '@nestjs/core';
import { appSetup } from './setup/app.setup';
import { createWriteStream } from 'fs';
import { get } from 'http';
import { CoreConfig } from './core/config';
import { ENVIRONMENTS } from './constants';
import { initAppModule } from './init-app-module';

async function bootstrap() {
  const dynamicAppModule = await initAppModule();
  // Create our Application based on the configured module
  const app = await NestFactory.create(dynamicAppModule);

  const coreConfig = app.get<CoreConfig>(CoreConfig);

  // Setup the application
  appSetup(app, coreConfig);

  // Start the server
  await app.listen(coreConfig.PORT);

  // Get the swagger json file (if app is running in development mode)
  if (coreConfig.NODE_ENV === ENVIRONMENTS.DEVELOPMENT) {
    const serverUrl = `${coreConfig.SERVER_URL}:${coreConfig.PORT}`;

    // Write swagger ui files
    get(`${serverUrl}/api/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      console.log(
        `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
      );
    });

    get(`${serverUrl}/api/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      console.log(
        `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
      );
    });

    get(
      `${serverUrl}/api/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        console.log(
          `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
        );
      },
    );

    get(`${serverUrl}/api/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      console.log(
        `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
      );
    });
  }
}

bootstrap();
