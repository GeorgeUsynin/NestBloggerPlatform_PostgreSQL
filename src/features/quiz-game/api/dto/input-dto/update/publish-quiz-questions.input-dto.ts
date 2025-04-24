import { UpdatePublishQuizQuestionDto } from '../../../../domain/dto/update/publish-quiz-question.update-dto';
import { IsDefinedWithMessage } from '../../../../../../core/decorators/validation';
import { IsBoolean } from 'class-validator';

export class UpdatePublishQuizQuestionsInputDto
  implements UpdatePublishQuizQuestionDto
{
  @IsBoolean()
  @IsDefinedWithMessage()
  published: boolean;
}
