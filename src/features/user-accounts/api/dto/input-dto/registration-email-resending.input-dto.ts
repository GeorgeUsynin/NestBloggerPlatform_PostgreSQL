import {
  IsStringWithTrim,
  MatchesWithMessage,
} from '../../../../../core/decorators/validation';
import { emailConstraints } from '../constraints';

export class RegistrationEmailResendingInputDto {
  @MatchesWithMessage(emailConstraints.match)
  @IsStringWithTrim()
  email: string;
}
