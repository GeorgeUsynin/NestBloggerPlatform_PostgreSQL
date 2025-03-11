import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const DeleteBlogApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete blog specified by id',
    }),
    ApiParam({ name: 'id', type: String, description: 'Blog id' }),
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
