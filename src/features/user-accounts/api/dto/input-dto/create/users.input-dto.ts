import { CreateUserDto } from '../../../../domain/dto/create/users.create-dto';
import {
  IsStringWithTrim,
  LengthWithMessage,
  MatchesWithMessage,
} from '../../../../../../core/decorators/validation';
import {
  emailConstraints,
  loginConstraints,
  passwordConstraints,
} from '../../constraints';

export class CreateUserInputDto {
  // Call order: @IsStringWithTrim() -> @MatchesWithMessage() -> @LengthWithMessage()
  @MatchesWithMessage(loginConstraints.match)
  @LengthWithMessage(loginConstraints.minLength, loginConstraints.maxLength)
  @IsStringWithTrim()
  login: string;

  @LengthWithMessage(
    passwordConstraints.minLength,
    passwordConstraints.maxLength,
  )
  @IsStringWithTrim()
  password: string;

  @MatchesWithMessage(emailConstraints.match)
  @IsStringWithTrim()
  email: string;
}

// We can utilize the CreateUserDto class, which we created earlier,
// to describe the parameters of the application and domain layers. However,
// we have separated these DTOs because, in the future, the input-dto
// might include details exclusive to the presentation layer (for example, Swagger decorators).
