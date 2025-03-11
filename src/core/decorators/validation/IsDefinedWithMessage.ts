import { IsDefined, ValidationOptions } from 'class-validator';
import { defaultValidationMessages } from './defaultValidationMessages';

export const IsDefinedWithMessage = (validationOptions?: ValidationOptions) =>
  IsDefined({
    message: defaultValidationMessages.isDefined,
    ...validationOptions,
  });
