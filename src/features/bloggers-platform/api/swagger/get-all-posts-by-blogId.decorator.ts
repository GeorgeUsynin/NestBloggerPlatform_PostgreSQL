import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../../core/decorators/swagger/ApiPaginatedResponse.decorator';
import { PostViewDto } from '../dto/view-dto/posts.view-dto';

export const GetAllPostsByBlogIdApi = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Returns all posts for specified blog' }),
    ApiParam({ name: 'blogId', type: String, description: 'Blog id' }),
    ApiPaginatedResponse(PostViewDto),
    ApiNotFoundResponse({
      description: 'If specified blog is not exists',
    }),
  );
};
