import { applyDecorators } from '@nestjs/common';
import { IsStringWithMessage } from './IsStringWithMessage';
import { IsDefinedWithMessage } from './IsDefinedWithMessage';
import { Trim } from '../transform';
import { IsNotEmptyWithMessage } from './IsNotEmptyWithMessage';
import { ValidationOptions } from 'class-validator';

export const IsStringWithTrim = (validationOptions?: ValidationOptions) =>
  // Combines decorators
  applyDecorators(
    // Trim transform decorator applied first, before validation decorators !!!
    Trim(),
    // Call order: @IsDefinedWithMessage() -> @IsStringWithMessage() -> @IsNotEmptyWithMessage()
    IsDefinedWithMessage(validationOptions),
    IsStringWithMessage(validationOptions),
    IsNotEmptyWithMessage(validationOptions),
  );
