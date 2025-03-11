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
import { RegistrationConfirmationInputDto } from '../../dto/input-dto/registration-confirmation.input-dto';

class SwaggerRegistrationConfirmationInputDto
  implements RegistrationConfirmationInputDto
{
  @ApiProperty({
    type: String,
    description: 'Code that be sent via Email inside link',
  })
  code: string;
}

export const RegistrationConfirmationApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Confirm registration',
    }),
    ApiBody({ type: SwaggerRegistrationConfirmationInputDto, required: false }),
    ApiNoContentResponse({
      description: 'Email was verified. Account was activated',
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
