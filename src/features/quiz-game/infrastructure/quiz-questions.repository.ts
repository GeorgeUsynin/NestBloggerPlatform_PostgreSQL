import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../domain/question.entity';
import { CreateQuizQuestionDto } from '../domain/dto/create/quiz-questions.create-dto';

@Injectable()
export class QuizQuestionsRepository {
  constructor(
    @InjectRepository(Question)
    private quizQuestionsRepository: Repository<Question>,
  ) {}

  create(dto: CreateQuizQuestionDto) {
    return this.quizQuestionsRepository.create(dto);
  }

  async findQuizQuestionByIdOrNotFoundFail(id: number) {
    const quizQuestion = await this.quizQuestionsRepository.findOneBy({ id });

    if (!quizQuestion) {
      throw NotFoundDomainException.create('Quiz question not found');
    }

    return quizQuestion;
  }

  async softDeleteBlogById(id: number) {
    return this.quizQuestionsRepository.softDelete(id);
  }

  async deleteAllQuizQuestions() {
    return this.quizQuestionsRepository.delete({});
  }

  async save(quizQuestion: Question) {
    return this.quizQuestionsRepository.save(quizQuestion);
  }
}
