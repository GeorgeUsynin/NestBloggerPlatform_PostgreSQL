import { ApiProperty } from '@nestjs/swagger';
import { Blog } from '../../../domain/blog.entity';

export class BlogViewDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  websiteUrl: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({
    type: Boolean,
    description: 'True if user has not expired membership subscription to blog',
  })
  isMembership: boolean;

  static mapToView(blog: Blog): BlogViewDto {
    const dto = new BlogViewDto();

    dto.id = blog.id.toString();
    dto.description = blog.description;
    dto.name = blog.name;
    dto.websiteUrl = blog.websiteUrl;
    dto.createdAt = blog.createdAt;
    dto.isMembership = blog.isMembership;

    return dto;
  }
}
