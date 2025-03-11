import { ValidationArguments } from 'class-validator';

export const defaultValidationMessages = {
  isString: (validationArguments: ValidationArguments) =>
    `${validationArguments.property} must be a string.`,
  isDefined: (validationArguments: ValidationArguments) =>
    `${validationArguments.property} field is required.`,
  isNotEmptyString: (validationArguments: ValidationArguments) =>
    `${validationArguments.property} field should not be empty or contain only spaces`,
  length: (
    validationArguments: ValidationArguments,
    min: number,
    max: number,
  ) =>
    `${validationArguments.property} length should be from ${min} to ${max} characters`,
  matches: (validationArguments: ValidationArguments, pattern: RegExp) =>
    `${validationArguments.property} should match the specified ${pattern} pattern`,
  maxLength: (validationArguments: ValidationArguments, max: number) =>
    `${validationArguments.property} max length should be ${max} characters`,
};
