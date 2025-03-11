import {
  IsStringWithTrim,
  MatchesWithMessage,
} from '../../../../../core/decorators/validation';
import { emailConstraints } from '../../../domain/user.entity';

export class PasswordRecoveryInputDto {
  @MatchesWithMessage(emailConstraints.match)
  @IsStringWithTrim()
  email: string;
}
