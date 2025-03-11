import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../../core/decorators/swagger/ApiPaginatedResponse.decorator';
import { PostViewDto } from '../dto/view-dto/posts.view-dto';

export const GetAllPostsApi = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Returns posts with paging' }),
    ApiPaginatedResponse(PostViewDto),
  );
};
