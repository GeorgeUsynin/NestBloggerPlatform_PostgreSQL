import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../core/dto/swagger-errors-messages.view-dto';
import { PostViewDto } from '../dto/view-dto/posts.view-dto';
import { CreatePostInputDto } from '../dto/input-dto/create/posts.input-dto';
import {
  postContentConstraints,
  shortDescriptionConstraints,
  titleConstraints,
} from '../dto/constraints';
import { ApiProperty } from '@nestjs/swagger';

export class SwaggerCreatePostInputDto implements CreatePostInputDto {
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
    maxLength: postContentConstraints.maxLength,
  })
  content: string;
}

export const CreatePostByBlogIdApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create new post for specific blog',
    }),
    ApiParam({ name: 'blogId', type: String, description: 'Blog id' }),
    ApiBody({
      type: SwaggerCreatePostInputDto,
      description: 'Data for constructing new Post entity',
      required: false,
    }),
    ApiCreatedResponse({
      type: PostViewDto,
      description: 'Returns the newly created blog',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: SwaggerErrorsMessagesViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiNotFoundResponse({
      description: "If specified blog doesn't exists",
    }),
  );
};
