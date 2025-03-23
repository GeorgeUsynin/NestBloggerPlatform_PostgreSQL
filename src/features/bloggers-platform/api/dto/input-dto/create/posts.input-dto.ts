import {
  MaxLengthWithMessage,
  IsStringWithTrim,
} from '../../../../../../core/decorators/validation';
import { CreatePostDto } from '../../../../application/dto/create/posts.create-dto';
import {
  titleConstraints,
  shortDescriptionConstraints,
  postContentConstraints,
} from '../../constraints';

export class CreatePostInputDto implements CreatePostDto {
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
