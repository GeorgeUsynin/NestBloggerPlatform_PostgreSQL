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
import { CreateBlogInputDto } from '../dto/input-dto/create/blogs.input-dto';
import {
  descriptionConstraints,
  nameConstraints,
  websiteUrlConstraints,
} from '../../domain/blog.entity';
import { BlogViewDto } from '../dto/view-dto/blogs.view-dto';

export class SwaggerCreateBlogInputDto implements CreateBlogInputDto {
  @ApiProperty({
    type: String,
    maxLength: nameConstraints.maxLength,
  })
  name: string;

  @ApiProperty({
    type: String,
    maxLength: descriptionConstraints.maxLength,
  })
  description: string;

  @ApiProperty({
    type: String,
    maxLength: websiteUrlConstraints.maxLength,
    pattern: websiteUrlConstraints.match.source,
  })
  websiteUrl: string;
}

export const CreateBlogApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create new blog',
    }),
    ApiBody({
      type: SwaggerCreateBlogInputDto,
      description: 'Data for constructing new Blog entity',
      required: false,
    }),
    ApiCreatedResponse({
      type: BlogViewDto,
      description: 'Returns the newly created blog',
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
