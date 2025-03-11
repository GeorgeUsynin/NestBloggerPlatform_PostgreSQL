import {
  Matches,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { defaultValidationMessages } from './defaultValidationMessages';

export const MatchesWithMessage = (
  pattern: RegExp,
  validationOptions?: ValidationOptions,
) =>
  Matches(pattern, {
    message: (validationArguments: ValidationArguments) =>
      defaultValidationMessages.matches(validationArguments, pattern),
    ...validationOptions,
  });
