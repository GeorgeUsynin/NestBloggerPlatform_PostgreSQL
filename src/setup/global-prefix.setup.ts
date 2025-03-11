import { INestApplication } from '@nestjs/common';

export function globalPrefixSetup(app: INestApplication) {
  // Special method that adds /GLOBAL_PREFIX to all routes
  app.setGlobalPrefix('');
}
