import {
  IsStringWithTrim,
  LengthWithMessage,
} from '../../../../../core/decorators/validation';
import { passwordConstraints } from '../constraints';

export class NewPasswordInputDto {
  @LengthWithMessage(
    passwordConstraints.minLength,
    passwordConstraints.maxLength,
  )
  @IsStringWithTrim()
  newPassword: string;

  @IsStringWithTrim()
  recoveryCode: string;
}
