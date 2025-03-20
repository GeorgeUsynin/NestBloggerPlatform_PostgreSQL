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
import {
  contentConstraints,
  shortDescriptionConstraints,
  titleConstraints,
} from '../../domain/post.entity';
import { UpdatePostInputDto } from '../dto/input-dto/update/posts.input-dto';

export class SwaggerUpdatePostInputDto implements UpdatePostInputDto {
  @ApiProperty({
    type: String,
    maxLength: titleConstraints.maxLength,
  })
  title: string;

  @ApiProperty({
    type: String,
    maxLength: shortDescriptionConstraints.maxLength,
  })
  shortDescription: string;

  @ApiProperty({
    type: String,
    maxLength: contentConstraints.maxLength,
  })
  content: string;
}

export const UpdateByBlogIDAndPostIDApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Update existing post by id with InputModel',
    }),
    ApiParam({ name: 'blogId', type: String, description: 'Blog id' }),
    ApiParam({ name: 'postId', type: String, description: 'Post id' }),
    ApiBody({
      type: SwaggerUpdatePostInputDto,
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
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};
