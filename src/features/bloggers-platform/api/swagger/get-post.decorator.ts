import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { PostViewDto } from '../dto/view-dto/posts.view-dto';

export const GetPostApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns post by id',
    }),
    ApiParam({ name: 'id', type: String, description: 'Id of existing post' }),
    ApiOkResponse({
      description: 'Success',
      type: PostViewDto,
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};
