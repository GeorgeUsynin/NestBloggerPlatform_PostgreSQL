import { UpdateBlogDto } from '../../../../domain/dto/update/blogs.update-dto';
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

export class UpdateBlogInputDto implements UpdateBlogDto {
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
