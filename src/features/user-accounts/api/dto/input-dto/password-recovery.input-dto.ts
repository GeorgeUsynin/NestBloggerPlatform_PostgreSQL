import {
  IsStringWithTrim,
  MatchesWithMessage,
} from '../../../../../core/decorators/validation';
import { emailConstraints } from '../constraints';

export class PasswordRecoveryInputDto {
  @MatchesWithMessage(emailConstraints.match)
  @IsStringWithTrim()
  email: string;
}
