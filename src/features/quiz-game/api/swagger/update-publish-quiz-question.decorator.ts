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
import { UpdatePublishQuizQuestionsInputDto } from '../dto/input-dto/update/publish-quiz-questions.input-dto';

export class SwaggerUpdatePublishQuizQuestionsInputDto
  implements UpdatePublishQuizQuestionsInputDto
{
  @ApiProperty({
    type: Boolean,
    description:
      'True if question is completed and can be used in the Quiz game',
  })
  published: boolean;
}

export const UpdatePublishQuizQuestionApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Publish/unpublish question',
    }),
    ApiParam({ name: 'id', type: String, description: 'Question id' }),
    ApiBody({
      type: SwaggerUpdatePublishQuizQuestionsInputDto,
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
