import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../../core/decorators/swagger/ApiPaginatedResponse.decorator';
import { QuizQuestionViewDto } from '../dto/view-dto/quiz-questions.view-dto';

export const GetAllQuizQuestionsApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns all questions with pagination and filtering',
    }),
    ApiPaginatedResponse(QuizQuestionViewDto),
  );
};
