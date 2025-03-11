import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../../core/dto/swagger-errors-messages.view-dto';
import { SwaggerCreateUserInputDto } from '../auth/registration.decorator';
import { UserViewDto } from '../../dto/view-dto/user.view-dto';

export const CreateUserApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Add new user to the system',
    }),
    ApiBody({
      type: SwaggerCreateUserInputDto,
      description: 'Data for constructing new user',
      required: false,
    }),
    ApiCreatedResponse({
      type: UserViewDto,
      description: 'Returns the newly created user',
    }),
    ApiBadRequestResponse({
      type: SwaggerErrorsMessagesViewDto,
      description:
        'If the inputModel has incorrect values <br/> <br/> <i>Note: If the error should be in the BLL, for example, "the email address is not unique", do not try to mix this error with input validation errors in the middleware, just return one element in the errors array</i>',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
