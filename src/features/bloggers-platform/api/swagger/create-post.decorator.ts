import { CreatePostInputDto } from '../dto/input-dto/create/posts.input-dto';
import {
  contentConstraints,
  shortDescriptionConstraints,
  titleConstraints,
} from '../../domain/post.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SwaggerCreatePostInputDto implements CreatePostInputDto {
  @ApiProperty({
    type: String,
    maxLength: titleConstraints.maxLength,
  })
  title: string;

  @ApiProperty({
    type: String,
    maxLength: shortDescriptionConstraints.maxLength,
  })
  shortDescription: string;

  @ApiProperty({
    type: String,
    maxLength: contentConstraints.maxLength,
  })
  content: string;
}
