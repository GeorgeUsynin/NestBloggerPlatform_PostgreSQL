import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizQuestionsRepository } from '../../../infrastructure/quiz-questions.repository';

export class DeleteQuizQuestionCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteQuizQuestionCommand)
export class DeleteQuizQuestionUseCase
  implements ICommandHandler<DeleteQuizQuestionCommand, void>
{
  constructor(private quizQuestionsRepository: QuizQuestionsRepository) {}

  async execute({ id }: DeleteQuizQuestionCommand) {
    await this.quizQuestionsRepository.findQuizQuestionByIdOrNotFoundFail(id);

    await this.quizQuestionsRepository.softDeleteBlogById(id);
  }
}
