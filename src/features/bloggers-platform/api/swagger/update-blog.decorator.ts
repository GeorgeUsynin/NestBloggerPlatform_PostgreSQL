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
  descriptionConstraints,
  nameConstraints,
  websiteUrlConstraints,
} from '../dto/constraints';
import { UpdateBlogInputDto } from '../dto/input-dto/update/blogs.input-dto';

export class SwaggerUpdateBlogInputDto implements UpdateBlogInputDto {
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

export const UpdateBlogApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Update existing Blog by id with InputModel',
    }),
    ApiParam({ name: 'id', type: String, description: 'Blog id' }),
    ApiBody({
      type: SwaggerUpdateBlogInputDto,
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
