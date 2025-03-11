import {
  IsStringWithTrim,
  MatchesWithMessage,
} from '../../../../../core/decorators/validation';
import { emailConstraints } from '../../../domain/user.entity';

export class RegistrationEmailResendingInputDto {
  @MatchesWithMessage(emailConstraints.match)
  @IsStringWithTrim()
  email: string;
}
