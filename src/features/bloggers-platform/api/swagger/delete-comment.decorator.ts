import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const DeleteCommentApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete comment specified by id',
    }),
    ApiParam({ name: 'id', type: String, description: 'Comment id' }),
    ApiNoContentResponse({
      description: 'No Content',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiForbiddenResponse({
      description: 'If try delete the comment that is not your own',
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};
