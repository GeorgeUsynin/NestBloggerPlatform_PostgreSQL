import { SchemaTimestampsConfig } from 'mongoose';
import { PostDocument } from '../../../domain/post.entity';
import { LikeStatus } from '../../../types';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ type: String })
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
  createdAt: SchemaTimestampsConfig['createdAt'];

  @ApiProperty({ type: ExtendedLikesInfoDto })
  extendedLikesInfo: ExtendedLikesInfoDto;

  static mapToView(
    post: PostDocument,
    myStatus: LikeStatus,
    newestLikes: NewestLikesDto[],
  ): PostViewDto {
    const dto = new PostViewDto();

    dto.id = post._id.toString();
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.content = post.content;
    dto.createdAt = post.createdAt;
    dto.shortDescription = post.shortDescription;
    dto.title = post.title;
    dto.extendedLikesInfo = {
      dislikesCount: post.likesInfo.dislikesCount,
      likesCount: post.likesInfo.likesCount,
      myStatus,
      newestLikes,
    };

    return dto;
  }
}
