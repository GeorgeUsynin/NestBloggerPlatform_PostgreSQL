import {
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { BadRequestDomainException } from '../core/exceptions/domain-exceptions';

type ErrorResponse = { field: string; message: string };

const errorsFormatter = (
  errors: ValidationError[],
  errorsMessages?: ErrorResponse[] | [],
) => {
  const errorsForResponse = errorsMessages || [];

  for (const error of errors) {
    if (!error.constraints && error.children?.length) {
      errorsFormatter(error.children, errorsForResponse);
    } else if (error.constraints) {
      const constrainKeys = Object.keys(error.constraints);

      for (const key of constrainKeys) {
        errorsForResponse.push({
          field: error.property,
          message: error.constraints[key],
        });
      }
    }
  }

  return errorsForResponse;
};

export function pipesSetup(app: INestApplication) {
  //Global pipe for validation and transformation of incoming data.

  app.useGlobalPipes(
    new ValidationPipe({
      //class-transformer creates an instance of dto
      //therefore, default values will be applied
      //inheritance will work
      //and methods of dto classes
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errorsFormatter(errors);

        throw new BadRequestDomainException(formattedErrors);
      },
    }),
  );
}
