import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionsRepository } from '../../../infrastructure/quiz-questions.repository';
import { UpdatePublishQuizQuestionDto } from '../../../domain/dto/update/publish-quiz-question.update-dto';

export class UpdatePublishQuizQuestionCommand {
  constructor(
    public readonly quizQuestionId: number,
    public readonly dto: UpdatePublishQuizQuestionDto,
  ) {}
}

@CommandHandler(UpdatePublishQuizQuestionCommand)
export class UpdatePublishQuizQuestionUseCase
  implements ICommandHandler<UpdatePublishQuizQuestionCommand, void>
{
  constructor(private quizQuestionsRepository: QuizQuestionsRepository) {}

  async execute({ quizQuestionId, dto }: UpdatePublishQuizQuestionCommand) {
    const quizQuestion =
      await this.quizQuestionsRepository.findQuizQuestionByIdOrNotFoundFail(
        quizQuestionId,
      );

    quizQuestion.isPublished = dto.published;

    await this.quizQuestionsRepository.save(quizQuestion);
  }
}
