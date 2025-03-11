import { OmitType } from '@nestjs/swagger';
import {
  contentConstraints,
  shortDescriptionConstraints,
  titleConstraints,
} from '../../../../domain/post.entity';
import {
  MaxLengthWithMessage,
  IsStringWithTrim,
} from '../../../../../../core/decorators/validation';
import { CreatePostDto } from '../../../../application/dto/create/posts.create-dto';
import { BlogIsExist } from '../../../validate/blog-is-exist.decorator';

export class CreatePostInputDto implements CreatePostDto {
  @MaxLengthWithMessage(titleConstraints.maxLength)
  @IsStringWithTrim()
  title: string;

  @MaxLengthWithMessage(shortDescriptionConstraints.maxLength)
  @IsStringWithTrim()
  shortDescription: string;

  @MaxLengthWithMessage(contentConstraints.maxLength)
  @IsStringWithTrim()
  content: string;

  // https://github.com/typestack/class-validator?tab=readme-ov-file#custom-validation-decorators
  @BlogIsExist()
  @IsStringWithTrim()
  blogId: string;
}

export class CreatePostInputDtoWithoutBlogId extends OmitType(
  CreatePostInputDto,
  ['blogId'] as const,
) {}
