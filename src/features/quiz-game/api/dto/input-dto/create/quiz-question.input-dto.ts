import { CreateQuizQuestionDto } from '../../../../domain/dto/create/quiz-questions.create-dto';
import {
  IsStringWithTrim,
  LengthWithMessage,
} from '../../../../../../core/decorators/validation';
import { bodyConstraints } from '../../constraints';
import { ArrayMinSize, ArrayUnique, IsArray } from 'class-validator';

export class CreateQuizQuestionInputDto implements CreateQuizQuestionDto {
  @LengthWithMessage(bodyConstraints.minLength, bodyConstraints.maxLength)
  @IsStringWithTrim()
  body: string;

  @ArrayMinSize(1)
  @IsStringWithTrim({ each: true })
  @ArrayUnique()
  @IsArray()
  correctAnswers: string[];
}
