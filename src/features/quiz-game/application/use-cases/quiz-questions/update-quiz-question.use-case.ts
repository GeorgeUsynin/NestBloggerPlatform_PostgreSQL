import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionsRepository } from '../../../infrastructure/quiz-questions.repository';
import { UpdateQuizQuestionDto } from '../../../domain/dto/update/quiz-questions.update-dto';

export class UpdateQuizQuestionCommand {
  constructor(
    public readonly quizQuestionId: number,
    public readonly dto: UpdateQuizQuestionDto,
  ) {}
}

@CommandHandler(UpdateQuizQuestionCommand)
export class UpdateQuizQuestionUseCase
  implements ICommandHandler<UpdateQuizQuestionCommand, void>
{
  constructor(private quizQuestionsRepository: QuizQuestionsRepository) {}

  async execute({ quizQuestionId, dto }: UpdateQuizQuestionCommand) {
    const quizQuestion =
      await this.quizQuestionsRepository.findQuizQuestionByIdOrNotFoundFail(
        quizQuestionId,
      );

    quizQuestion.body = dto.body;
    quizQuestion.correctAnswers = dto.correctAnswers;

    await this.quizQuestionsRepository.save(quizQuestion);
  }
}
