import { IsNotEmpty, ValidationOptions } from 'class-validator';
import { defaultValidationMessages } from './defaultValidationMessages';

export const IsNotEmptyWithMessage = (validationOptions?: ValidationOptions) =>
  IsNotEmpty({
    message: defaultValidationMessages.isNotEmptyString,
    ...validationOptions,
  });
