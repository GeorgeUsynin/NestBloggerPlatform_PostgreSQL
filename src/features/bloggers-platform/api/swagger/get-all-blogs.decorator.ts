import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../../core/decorators/swagger/ApiPaginatedResponse.decorator';
import { BlogViewDto } from '../dto/view-dto/blogs.view-dto';

export const GetAllBlogsApi = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Returns blogs with paging' }),
    ApiPaginatedResponse(BlogViewDto),
  );
};
