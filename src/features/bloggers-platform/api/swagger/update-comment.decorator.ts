import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { contentConstraints } from '../../domain/comment.entity';
import { SwaggerErrorsMessagesViewDto } from '../../../../core/dto/swagger-errors-messages.view-dto';
import { UpdateCommentInputDto } from '../dto/input-dto/update/comments.input-dto';

export class SwaggerUpdateCommentInputDto implements UpdateCommentInputDto {
  @ApiProperty({
    type: String,
    minLength: contentConstraints.minLength,
    maxLength: contentConstraints.maxLength,
  })
  content: string;
}

export const UpdateCommentApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Update existing comment by id with InputModel',
    }),
    ApiParam({ name: 'id', type: String, description: 'Comment id' }),
    ApiBody({
      type: SwaggerUpdateCommentInputDto,
      description: 'Data for updating',
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
    ApiForbiddenResponse({
      description: 'If try edit the comment that is not your own',
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};
