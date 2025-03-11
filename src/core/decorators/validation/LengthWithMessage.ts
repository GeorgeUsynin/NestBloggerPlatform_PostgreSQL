import {
  Length,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { defaultValidationMessages } from './defaultValidationMessages';

export const LengthWithMessage = (
  min: number,
  max: number,
  validationOptions?: ValidationOptions,
) =>
  Length(min, max, {
    message: (validationArguments: ValidationArguments) =>
      defaultValidationMessages.length(validationArguments, min, max),
    ...validationOptions,
  });
