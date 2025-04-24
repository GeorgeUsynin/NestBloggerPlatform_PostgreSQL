import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizQuestionsSAController } from './api/quiz-questions-sa.controller';
import {
  CreateQuizQuestionUseCase,
  UpdatePublishQuizQuestionUseCase,
  UpdateQuizQuestionUseCase,
  DeleteQuizQuestionUseCase,
} from './application/use-cases';
import { QuizQuestionsRepository } from './infrastructure/quiz-questions.repository';
import { QuizQuestionsQueryRepository } from './infrastructure/quiz-questions.query-repository';
import { Question } from './domain/question.entity';
import { PlayerProgress } from './domain/playerProgress.entity';
import { QuestionOfTheGame } from './domain/questionOfTheGame.entity';
import { AnswerOfThePlayer } from './domain/answerOfThePlayer.entity';
import { Game } from './domain/game.entity';
import { UsersAccountsModule } from '../user-accounts/usersAccounts.module';

const useCases = [
  CreateQuizQuestionUseCase,
  UpdatePublishQuizQuestionUseCase,
  UpdateQuizQuestionUseCase,
  DeleteQuizQuestionUseCase,
];
const repositories = [QuizQuestionsRepository];
const queryRepositories = [QuizQuestionsQueryRepository];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Game,
      PlayerProgress,
      Question,
      QuestionOfTheGame,
      AnswerOfThePlayer,
    ]),
    UsersAccountsModule,
  ],
  controllers: [QuizQuestionsSAController],
  providers: [...repositories, ...queryRepositories, ...useCases],
  exports: [QuizQuestionsRepository],
})
export class QuizGameModule {}
