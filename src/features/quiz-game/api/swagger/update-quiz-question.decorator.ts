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
import { bodyConstraints } from '../dto/constraints';
import { UpdateQuizQuestionInputDto } from '../dto/input-dto/update/quiz-question.input-dto';

export class SwaggerUpdateQuizQuestionInputDto
  implements UpdateQuizQuestionInputDto
{
  @ApiProperty({
    type: String,
    maxLength: bodyConstraints.maxLength,
    minLength: bodyConstraints.minLength,
  })
  body: string;

  @ApiProperty({
    type: [String],
    minItems: 1,
    uniqueItems: true,
  })
  correctAnswers: string[];
}

export const UpdateQuizQuestionApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Update existing Question by id with InputModel',
    }),
    ApiParam({ name: 'id', type: String, description: 'Question id' }),
    ApiBody({
      type: SwaggerUpdateQuizQuestionInputDto,
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
