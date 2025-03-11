import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CommentViewDto } from '../dto/view-dto/comments.view-dto';

export const GetCommentApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns comment by id',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Id of existing comment',
    }),
    ApiOkResponse({
      description: 'Success',
      type: CommentViewDto,
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};
