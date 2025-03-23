import { UpdatePostDto } from '../../../../domain/dto/update/posts.update-dto';
import {
  postContentConstraints,
  shortDescriptionConstraints,
  titleConstraints,
} from '../../constraints';
import {
  MaxLengthWithMessage,
  IsStringWithTrim,
} from '../../../../../../core/decorators/validation';

export class UpdatePostInputDto implements UpdatePostDto {
  @MaxLengthWithMessage(titleConstraints.maxLength)
  @IsStringWithTrim()
  title: string;

  @MaxLengthWithMessage(shortDescriptionConstraints.maxLength)
  @IsStringWithTrim()
  shortDescription: string;

  @MaxLengthWithMessage(postContentConstraints.maxLength)
  @IsStringWithTrim()
  content: string;
}
