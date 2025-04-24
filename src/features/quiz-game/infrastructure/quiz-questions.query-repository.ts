import { Injectable } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../domain/question.entity';
import {
  GetQuizQuestionsQueryParams,
  QuizQuestionsPublishedStatus,
} from '../api/dto/query-params-dto/get-quiz-questions-query-params.input-dto';
import { QuizQuestionViewDto } from '../api/dto/view-dto/quiz-questions.view-dto';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class QuizQuestionsQueryRepository {
  constructor(
    @InjectRepository(Question)
    private quizQuestionRepository: Repository<Question>,
  ) {}

  async getByIdOrNotFoundFail(id: number): Promise<QuizQuestionViewDto> {
    const quizQuestion = await this.quizQuestionRepository.findOneBy({ id });

    if (!quizQuestion) {
      throw NotFoundDomainException.create('Quiz question not found');
    }

    return QuizQuestionViewDto.mapToView(quizQuestion);
  }

  async getAllQuizQuestions(
    query: GetQuizQuestionsQueryParams,
  ): Promise<PaginatedViewDto<QuizQuestionViewDto[]>> {
    const { sortBy, sortDirection, pageSize, bodySearchTerm, publishedStatus } =
      query;

    const builder = this.quizQuestionRepository
      .createQueryBuilder('question')
      .orderBy(
        `question.${sortBy}`,
        sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .offset(query.calculateSkip())
      .limit(pageSize);

    const whereConditions: string[] = [];
    const parameters: Record<string, string | boolean> = {};

    if (bodySearchTerm) {
      whereConditions.push('question.body ILIKE :body');
      parameters.body = `%${bodySearchTerm}%`;
    }

    if (publishedStatus === QuizQuestionsPublishedStatus.Published) {
      whereConditions.push('question."isPublished" = :isPublished');
      parameters.isPublished = true;
    }

    if (publishedStatus === QuizQuestionsPublishedStatus.NotPublished) {
      whereConditions.push('question."isPublished" = :isPublished');
      parameters.isPublished = false;
    }

    if (whereConditions.length > 0) {
      builder.where(whereConditions.join(' AND '), parameters);
    }

    const [quizQuestions, totalCount] = await builder.getManyAndCount();

    return PaginatedViewDto.mapToView({
      items: quizQuestions.map((item) => QuizQuestionViewDto.mapToView(item)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }
}
