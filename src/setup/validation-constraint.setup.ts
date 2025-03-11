import { INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { CoreConfig } from '../core/config';

/**
 * For dependency injection in validator constraint decorator
 * @param app
 * @param coreConfig
 */
export const validationConstraintSetup = async (
  app: INestApplication,
  coreConfig: CoreConfig,
) => {
  // {fallbackOnErrors: true} is required because Nest generates an exception
  // when DI doesn't have the required class.
  const appContext = app.select(await AppModule.forRoot(coreConfig));

  useContainer(appContext, {
    fallbackOnErrors: true,
  });
};
