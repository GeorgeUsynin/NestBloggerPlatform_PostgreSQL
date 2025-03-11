import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { globalPrefixSetup } from './global-prefix.setup';
import { pipesSetup } from './pipes.setup';
import { swaggerSetup } from './swagger.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import { CoreConfig } from '../core/config';
import { validationConstraintSetup } from './validation-constraint.setup';

export function appSetup(app: INestApplication, coreConfig: CoreConfig) {
  // Enable CORS
  app.enableCors();
  // Setup global pipes
  pipesSetup(app);
  // Setup global prefix
  globalPrefixSetup(app);
  // Setup swagger
  swaggerSetup(app, coreConfig);
  // Setup exception filters
  exceptionFilterSetup(app, coreConfig);
  // Add cookie parser
  app.use(cookieParser());
  // Setup validation constraints DI
  validationConstraintSetup(app, coreConfig);
  // @ts-expect-error need proper type
  // Allows to get correct IP address from req.ip
  app.set('trust proxy', true);
}
