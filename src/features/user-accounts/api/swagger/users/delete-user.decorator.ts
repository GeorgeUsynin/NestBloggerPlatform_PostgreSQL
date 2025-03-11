import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const DeleteUserApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete user specified by id',
    }),
    ApiParam({ name: 'id', type: String, description: 'User id' }),
    ApiNoContentResponse({
      description: 'No Content',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiNotFoundResponse({
      description: 'If specified user is not exists',
    }),
  );
};
