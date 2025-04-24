import { ApiProperty } from '@nestjs/swagger';
import { Question } from '../../../domain/question.entity';

export class QuizQuestionViewDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({
    type: String,
    description:
      'Text of question, for example: How many continents are there?',
  })
  body: string;

  @ApiProperty({
    type: [String],
    description:
      "All variants of possible correct answers for current questions Examples: ['6', 'six', 'шесть', 'дофига'] In Postgres save this data in JSON column",
  })
  correctAnswers: string[];

  @ApiProperty({
    type: Boolean,
    default: 'false',
    description: 'If question is completed and can be used in the Quiz game',
  })
  published: boolean;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  static mapToView(question: Question): QuizQuestionViewDto {
    const dto = new QuizQuestionViewDto();

    dto.id = question.id.toString();
    dto.body = question.body;
    dto.correctAnswers = question.correctAnswers;
    dto.published = question.isPublished;
    dto.createdAt = question.createdAt;
    dto.updatedAt = question.updatedAt;

    return dto;
  }
}
