import { UpdatePostDto } from '../../../../domain/dto/update/posts.update-dto';
import {
  contentConstraints,
  shortDescriptionConstraints,
  titleConstraints,
} from '../../../../domain/post.entity';
// import { BlogIsExist } from '../../../validate/blog-is-exist.decorator';
import {
  MaxLengthWithMessage,
  IsStringWithTrim,
} from '../../../../../../core/decorators/validation';
import { IsOptional } from 'class-validator';

export class UpdatePostInputDto implements UpdatePostDto {
  @MaxLengthWithMessage(titleConstraints.maxLength)
  @IsStringWithTrim()
  title: string;

  @MaxLengthWithMessage(shortDescriptionConstraints.maxLength)
  @IsStringWithTrim()
  shortDescription: string;

  @MaxLengthWithMessage(contentConstraints.maxLength)
  @IsStringWithTrim()
  content: string;

  // // https://github.com/typestack/class-validator?tab=readme-ov-file#custom-validation-decorators
  // @BlogIsExist()
  @IsOptional()
  @IsStringWithTrim()
  blogId: string;
}
