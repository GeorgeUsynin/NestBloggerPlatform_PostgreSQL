import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../core/dto/swagger-errors-messages.view-dto';
import { UpdateLikeInputDto } from '../dto/input-dto/update/likes.input-dto';
import { LikeStatus } from '../../domain/like.entity';

export class SwaggerUpdateCommentLikeStatusInputDto
  implements UpdateLikeInputDto
{
  @ApiProperty({
    enum: LikeStatus,
    description: 'Send None if you want to unlike|undislike',
  })
  likeStatus: LikeStatus;
}

export const UpdateCommentLikeStatusApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Make like/unlike/dislike/undislike operation',
    }),
    ApiParam({ name: 'id', type: String, description: 'Comment id' }),
    ApiBody({
      type: SwaggerUpdateCommentLikeStatusInputDto,
      description: 'Like model for make like/dislike/reset operation',
      required: false,
    }),
    ApiNoContentResponse({
      description: 'No Content',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: SwaggerErrorsMessagesViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiNotFoundResponse({
      description: "If comment with specified id doesn't exists",
    }),
  );
};
