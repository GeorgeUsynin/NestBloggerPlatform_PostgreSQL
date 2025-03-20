import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const DeleteByBlogIDAndPostIDApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete post specified by id',
    }),
    ApiParam({ name: 'blogId', type: String, description: 'Blog id' }),
    ApiParam({ name: 'postId', type: String, description: 'Post id' }),
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
