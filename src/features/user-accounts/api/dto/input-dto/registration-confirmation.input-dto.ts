import { IsStringWithTrim } from '../../../../../core/decorators/validation';

export class RegistrationConfirmationInputDto {
  @IsStringWithTrim()
  code: string;
}
