import { UpdateCommentDto } from '../../../../domain/dto/update/comments.update-dto';
import {
  LengthWithMessage,
  IsStringWithTrim,
} from '../../../../../../core/decorators/validation';
import { commentContentConstraints } from '../../constraints';

export class UpdateCommentInputDto implements UpdateCommentDto {
  @LengthWithMessage(
    commentContentConstraints.minLength,
    commentContentConstraints.maxLength,
  )
  @IsStringWithTrim()
  content: string;
}
