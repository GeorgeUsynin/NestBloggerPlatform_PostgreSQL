import { IsString, ValidationOptions } from 'class-validator';
import { defaultValidationMessages } from './defaultValidationMessages';

export const IsStringWithMessage = (validationOptions?: ValidationOptions) =>
  IsString({
    message: defaultValidationMessages.isString,
    ...validationOptions,
  });
