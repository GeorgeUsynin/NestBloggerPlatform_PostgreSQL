import { contentConstraints } from '../../../../domain/comment.entity';
import { UpdateCommentDto } from '../../../../domain/dto/update/comments.update-dto';
import {
  LengthWithMessage,
  IsStringWithTrim,
} from '../../../../../../core/decorators/validation';

export class UpdateCommentInputDto implements UpdateCommentDto {
  @LengthWithMessage(contentConstraints.minLength, contentConstraints.maxLength)
  @IsStringWithTrim()
  content: string;
}
