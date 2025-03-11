import { applyDecorators } from '@nestjs/common';
import { IsStringWithMessage } from './IsStringWithMessage';
import { IsDefinedWithMessage } from './IsDefinedWithMessage';
import { Trim } from '../transform';
import { IsNotEmptyWithMessage } from './IsNotEmptyWithMessage';

export const IsStringWithTrim = () =>
  // Combines decorators
  applyDecorators(
    // Trim transform decorator applied first, before validation decorators !!!
    Trim(),
    // Call order: @IsDefinedWithMessage() -> @IsStringWithMessage() -> @IsNotEmptyWithMessage()
    IsDefinedWithMessage(),
    IsStringWithMessage(),
    IsNotEmptyWithMessage(),
  );
