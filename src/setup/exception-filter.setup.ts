import { INestApplication } from '@nestjs/common';
import { AllExceptionsFilter } from '../core/exceptions/filters/all-exceptions-filter';
import { DomainExceptionsFilter } from '../core/exceptions/filters/domain-exceptions-filter';
import { CoreConfig } from '../core/config';

export function exceptionFilterSetup(
  app: INestApplication,
  coreConfig: CoreConfig,
) {
  // Connect our filters. The order is important here! (it will work from right to left)
  app.useGlobalFilters(
    new AllExceptionsFilter(coreConfig),
    new DomainExceptionsFilter(),
  );
}
