import { SchemaTimestampsConfig } from 'mongoose';
import { LikeStatus } from '../../../types';
import { ApiProperty } from '@nestjs/swagger';
import { DBPost } from 'src/features/bloggers-platform/infrastructure/types';

class NewestLikesDto {
  @ApiProperty({ type: Date })
  addedAt: string;

  @ApiProperty({ type: Number, nullable: true })
  userId: number;

  @ApiProperty({ type: String, nullable: true })
  login: string;
}

class ExtendedLikesInfoDto {
  @ApiProperty({ type: Number, description: 'Total likes for parent item' })
  likesCount: number;

  @ApiProperty({ type: Number, description: 'Total dislikes for parent item' })
  dislikesCount: number;

  @ApiProperty({
    enum: LikeStatus,
    description: 'Send None if you want to unlike\/undislike',
  })
  myStatus: LikeStatus;

  @ApiProperty({
    type: [NewestLikesDto],
    description: 'Last 3 likes',
    nullable: true,
  })
  newestLikes: NewestLikesDto[];
}

export class PostViewDto {
  @ApiProperty({ type: Number })
  id: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  shortDescription: string;

  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({ type: String })
  blogId: string;

  @ApiProperty({ type: String })
  blogName: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: ExtendedLikesInfoDto })
  extendedLikesInfo: ExtendedLikesInfoDto;

  static mapToView(
    post: DBPost,
    myStatus: LikeStatus,
    newestLikes: NewestLikesDto[],
  ): PostViewDto {
    const dto = new PostViewDto();

    dto.id = post.id.toString();
    dto.blogId = post.blogId.toString();
    dto.blogName = post.blogName;
    dto.content = post.content;
    dto.createdAt = post.createdAt;
    dto.shortDescription = post.shortDescription;
    dto.title = post.title;
    dto.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus,
      newestLikes,
    };

    return dto;
  }
}
