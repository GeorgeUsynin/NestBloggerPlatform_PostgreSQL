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
import { bodyConstraints } from '../dto/constraints';
import { CreateQuizQuestionInputDto } from '../dto/input-dto/create/quiz-question.input-dto';
import { QuizQuestionViewDto } from '../dto/view-dto/quiz-questions.view-dto';

export class SwaggerCreateQuizQuestionInputDto
  implements CreateQuizQuestionInputDto
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

export const CreateQuizQuestionApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create new question',
    }),
    ApiBody({
      type: SwaggerCreateQuizQuestionInputDto,
      description: 'Data for constructing new Question entity',
      required: false,
    }),
    ApiCreatedResponse({
      type: QuizQuestionViewDto,
      description: 'Returns the newly created question',
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
