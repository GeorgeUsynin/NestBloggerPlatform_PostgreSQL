import {
  MatchesWithMessage,
  MaxLengthWithMessage,
  IsStringWithTrim,
} from '../../../../../../core/decorators/validation';
import {
  descriptionConstraints,
  nameConstraints,
  websiteUrlConstraints,
} from '../../../../domain/blog.entity';
import { CreateBlogDto } from '../../../../domain/dto/create/blogs.create-dto';

export class CreateBlogInputDto implements CreateBlogDto {
  @MaxLengthWithMessage(nameConstraints.maxLength)
  @IsStringWithTrim()
  name: string;

  @MaxLengthWithMessage(descriptionConstraints.maxLength)
  @IsStringWithTrim()
  description: string;

  @MatchesWithMessage(websiteUrlConstraints.match)
  @MaxLengthWithMessage(websiteUrlConstraints.maxLength)
  @IsStringWithTrim()
  websiteUrl: string;
}
