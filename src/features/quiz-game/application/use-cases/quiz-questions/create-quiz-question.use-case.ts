import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateQuizQuestionDto } from '../../../domain/dto/create/quiz-questions.create-dto';
import { QuizQuestionsRepository } from '../../../infrastructure/quiz-questions.repository';

export class CreateQuizQuestionCommand {
  constructor(public readonly dto: CreateQuizQuestionDto) {}
}

@CommandHandler(CreateQuizQuestionCommand)
export class CreateQuizQuestionUseCase
  implements ICommandHandler<CreateQuizQuestionCommand, number>
{
  constructor(private quizQuestionsRepository: QuizQuestionsRepository) {}

  async execute({ dto }: CreateQuizQuestionCommand) {
    const newQuizQuestion = this.quizQuestionsRepository.create(dto);
    await this.quizQuestionsRepository.save(newQuizQuestion);

    return newQuizQuestion.id;
  }
}
