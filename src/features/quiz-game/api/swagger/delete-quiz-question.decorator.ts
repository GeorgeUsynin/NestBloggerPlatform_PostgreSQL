import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const DeleteQuizQuestionApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete quiz question specified by id',
    }),
    ApiParam({ name: 'id', type: String, description: 'Question id' }),
    ApiNoContentResponse({
      description: 'No Content',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};
