import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginSuccessViewDto } from '../../dto/view-dto/login-success.view-dto';
import { SwaggerErrorsMessagesViewDto } from '../../../../../core/dto/swagger-errors-messages.view-dto';

class SwaggerLoginInputDto {
  @ApiProperty({ type: String })
  loginOrEmail: string;

  @ApiProperty({ type: String })
  password: string;
}

class SwaggerLoginSuccessViewDto implements LoginSuccessViewDto {
  @ApiProperty({ type: String, description: 'JWT access token' })
  accessToken: string;
}

export const LoginApi = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Try login user to the system' }),
    ApiBody({ type: SwaggerLoginInputDto, required: false }),
    ApiOkResponse({
      type: SwaggerLoginSuccessViewDto,
      description:
        'Returns JWT accessToken (expired after 10 minutes) in body.',
    }),
    ApiBadRequestResponse({
      type: SwaggerErrorsMessagesViewDto,
      description: 'If the inputModel has incorrect values',
    }),
    ApiUnauthorizedResponse({
      description: 'If the password or login or email is wrong',
    }),
    ApiTooManyRequestsResponse({
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
};
