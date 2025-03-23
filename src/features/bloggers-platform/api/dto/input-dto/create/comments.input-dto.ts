import {
  LengthWithMessage,
  IsStringWithTrim,
} from '../../../../../../core/decorators/validation';
import { commentContentConstraints } from '../../constraints';

export class CreateCommentInputDto {
  @LengthWithMessage(
    commentContentConstraints.minLength,
    commentContentConstraints.maxLength,
  )
  @IsStringWithTrim()
  content: string;
}
