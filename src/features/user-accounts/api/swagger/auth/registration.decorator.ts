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
import { CreateUserInputDto } from '../../dto/input-dto/create/users.input-dto';
import {
  emailConstraints,
  loginConstraints,
  passwordConstraints,
} from '../../dto/constraints';

export class SwaggerCreateUserInputDto implements CreateUserInputDto {
  @ApiProperty({
    type: String,
    maxLength: loginConstraints.maxLength,
    minLength: loginConstraints.minLength,
    pattern: loginConstraints.match.source,
    description: 'must be unique',
  })
  login: string;

  @ApiProperty({
    type: String,
    maxLength: passwordConstraints.maxLength,
    minLength: passwordConstraints.minLength,
  })
  password: string;

  @ApiProperty({
    type: String,
    pattern: emailConstraints.match.source,
    example: 'example@example.com',
    description: 'must be unique',
  })
  email: string;
}

export const RegistrationApi = () => {
  return applyDecorators(
    ApiOperation({
      summary:
        'Registration in the system. Email with confirmation code will be send to passed email address',
    }),
    ApiBody({ type: SwaggerCreateUserInputDto, required: false }),
    ApiNoContentResponse({
      description:
        'Input data is accepted. Email with confirmation code will be send to passed email address',
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
