import {
  MaxLength,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { defaultValidationMessages } from './defaultValidationMessages';

export const MaxLengthWithMessage = (
  max: number,
  validationOptions?: ValidationOptions,
) =>
  MaxLength(max, {
    message: (validationArguments: ValidationArguments) =>
      defaultValidationMessages.maxLength(validationArguments, max),
    ...validationOptions,
  });
