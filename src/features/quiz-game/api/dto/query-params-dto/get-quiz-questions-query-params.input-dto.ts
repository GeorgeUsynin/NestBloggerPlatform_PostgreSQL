import { ApiProperty } from '@nestjs/swagger';
import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional } from 'class-validator';
import { IsStringWithMessage } from '../../../../../core/decorators/validation';

export enum QuizQuestionsSortBy {
  CreatedAt = 'createdAt',
}

export enum QuizQuestionsPublishedStatus {
  All = 'all',
  Published = 'published',
  NotPublished = 'notPublished',
}

// DTO for a query for a list of questions with pagination, sorting, and filtering
export class GetQuizQuestionsQueryParams extends BaseSortablePaginationParams<QuizQuestionsSortBy> {
  @ApiProperty({ enum: QuizQuestionsSortBy })
  @IsOptional()
  @IsEnum(QuizQuestionsSortBy)
  sortBy = QuizQuestionsSortBy.CreatedAt;

  @ApiProperty({ enum: QuizQuestionsPublishedStatus, required: false })
  @IsOptional()
  @IsEnum(QuizQuestionsPublishedStatus)
  publishedStatus = QuizQuestionsPublishedStatus.All;

  @ApiProperty({
    type: String,
    description:
      'Search term for question body: Question body should contain this term in any position',
    required: false,
  })
  @IsStringWithMessage()
  @IsOptional()
  bodySearchTerm: string | null = null;
}
