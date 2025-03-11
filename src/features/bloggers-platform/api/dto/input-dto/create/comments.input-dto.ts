import { contentConstraints } from '../../../../domain/comment.entity';
import {
  LengthWithMessage,
  IsStringWithTrim,
} from '../../../../../../core/decorators/validation';

export class CreateCommentInputDto {
  @LengthWithMessage(contentConstraints.minLength, contentConstraints.maxLength)
  @IsStringWithTrim()
  content: string;
}
