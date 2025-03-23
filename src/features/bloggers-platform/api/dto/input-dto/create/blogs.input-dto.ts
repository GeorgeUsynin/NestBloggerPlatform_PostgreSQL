import {
  MatchesWithMessage,
  MaxLengthWithMessage,
  IsStringWithTrim,
} from '../../../../../../core/decorators/validation';
import { CreateBlogDto } from '../../../../domain/dto/create/blogs.create-dto';
import {
  nameConstraints,
  descriptionConstraints,
  websiteUrlConstraints,
} from '../../constraints';

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
