import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiProperty,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../../core/dto/swagger-errors-messages.view-dto';
import { RegistrationEmailResendingInputDto } from '../../dto/input-dto/registration-email-resending.input-dto';
import { emailConstraints } from '../../../domain/user.entity';

class SwaggerRegistrationEmailResendingInputDto
  implements RegistrationEmailResendingInputDto
{
  @ApiProperty({
    type: String,
    pattern: emailConstraints.match.source,
    example: 'example@example.com',
    description: 'Email of already registered but not confirmed user',
  })
  email: string;
}

export const RegistrationEmailResendingApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Resend confirmation registration Email if user exists',
    }),
    ApiBody({
      type: SwaggerRegistrationEmailResendingInputDto,
      required: false,
    }),
    ApiNoContentResponse({
      description:
        'Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere',
    }),
    ApiBadRequestResponse({
      type: SwaggerErrorsMessagesViewDto,
      description: 'If the inputModel has incorrect values',
    }),
    ApiTooManyRequestsResponse({
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
};
