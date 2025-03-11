import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../core/dto/swagger-errors-messages.view-dto';
import { CreatePostInputDto } from '../dto/input-dto/create/posts.input-dto';
import {
  contentConstraints,
  shortDescriptionConstraints,
  titleConstraints,
} from '../../domain/post.entity';
import { PostViewDto } from '../dto/view-dto/posts.view-dto';

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
    maxLength: contentConstraints.maxLength,
  })
  content: string;

  @ApiProperty({
    type: String,
  })
  blogId: string;
}

export const CreatePostApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create new post',
    }),
    ApiBody({
      type: SwaggerCreatePostInputDto,
      description: 'Data for constructing new Blog entity',
      required: false,
    }),
    ApiCreatedResponse({
      type: PostViewDto,
      description: 'Returns the newly created post',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: SwaggerErrorsMessagesViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
