import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../../core/decorators/swagger/ApiPaginatedResponse.decorator';
import { CommentViewDto } from '../dto/view-dto/comments.view-dto';

export const GetAllCommentsByPostIdApi = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Returns comments for specified post' }),
    ApiParam({ name: 'postId', type: String, description: 'Post id' }),
    ApiPaginatedResponse(CommentViewDto),
    ApiNotFoundResponse({
      description: "If post for passed postId doesn't exist",
    }),
  );
};
