import { UpdateQuizQuestionDto } from '../../../../domain/dto/update/quiz-questions.update-dto';
import {
  IsStringWithTrim,
  LengthWithMessage,
} from '../../../../../../core/decorators/validation';
import { bodyConstraints } from '../../constraints';
import { ArrayMinSize, ArrayUnique, IsArray } from 'class-validator';

export class UpdateQuizQuestionInputDto implements UpdateQuizQuestionDto {
  @LengthWithMessage(bodyConstraints.minLength, bodyConstraints.maxLength)
  @IsStringWithTrim()
  body: string;

  @ArrayMinSize(1)
  @IsStringWithTrim({ each: true })
  @ArrayUnique()
  @IsArray()
  correctAnswers: string[];
}
