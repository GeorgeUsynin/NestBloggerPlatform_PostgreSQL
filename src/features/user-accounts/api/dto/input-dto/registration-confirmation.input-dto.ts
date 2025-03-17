import { IsUUID } from 'class-validator';
import { IsStringWithTrim } from '../../../../../core/decorators/validation';

export class RegistrationConfirmationInputDto {
  @IsStringWithTrim()
  @IsUUID()
  code: string;
}
