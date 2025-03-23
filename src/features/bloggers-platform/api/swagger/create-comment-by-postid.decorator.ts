import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../core/dto/swagger-errors-messages.view-dto';
import { CreateCommentInputDto } from '../dto/input-dto/create/comments.input-dto';
import { commentContentConstraints } from '../dto/constraints';
import { CommentViewDto } from '../dto/view-dto/comments.view-dto';

export class SwaggerCreateCommentInputDto implements CreateCommentInputDto {
  @ApiProperty({
    type: String,
    minLength: commentContentConstraints.minLength,
    maxLength: commentContentConstraints.maxLength,
  })
  content: string;
}

export const CreateCommentByPostIdApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create new comment for specified post',
    }),
    ApiParam({ name: 'postId', type: String, description: 'Post id' }),
    ApiBody({
      type: SwaggerCreateCommentInputDto,
      description: 'Data for constructing new comment entity',
      required: false,
    }),
    ApiCreatedResponse({
      type: CommentViewDto,
      description: 'Returns the newly created comment',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: SwaggerErrorsMessagesViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiNotFoundResponse({
      description: "If specified post doesn't exists",
    }),
  );
};
