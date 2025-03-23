import { UpdateBlogDto } from '../../../../domain/dto/update/blogs.update-dto';
import {
  MatchesWithMessage,
  MaxLengthWithMessage,
  IsStringWithTrim,
} from '../../../../../../core/decorators/validation';

const websiteUrlConstraints = {
  maxLength: 100,
  match: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
};

const nameConstraints = {
  maxLength: 15,
};

const descriptionConstraints = {
  maxLength: 500,
};

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
