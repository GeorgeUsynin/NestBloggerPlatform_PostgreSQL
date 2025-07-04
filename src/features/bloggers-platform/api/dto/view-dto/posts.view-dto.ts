import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../../domain/post.entity';
import { LikeStatus } from '../../../domain/like.entity';

class MapViewPostData {
  id: Post['id'];
  blogId: Post['blogId'];
  blogName: Post['blogName'];
  content: Post['content'];
  createdAt: Post['createdAt'];
  shortDescription: Post['shortDescription'];
  title: Post['title'];
  myStatus: LikeStatus;
  dislikesCount: number;
  likesCount: number;
  newestLikes: NewestLikesDto[];
}

export class NewestLikesDto {
  @ApiProperty({ type: Date })
  addedAt: Date;

  @ApiProperty({ type: String, nullable: true })
  userId: string;

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
  createdAt: Date;

  @ApiProperty({ type: ExtendedLikesInfoDto })
  extendedLikesInfo: ExtendedLikesInfoDto;

  static mapToView(postData: MapViewPostData): PostViewDto {
    const dto = new PostViewDto();

    dto.id = postData.id.toString();
    dto.blogId = postData.blogId.toString();
    dto.blogName = postData.blogName;
    dto.content = postData.content;
    dto.createdAt = postData.createdAt;
    dto.shortDescription = postData.shortDescription;
    dto.title = postData.title;
    dto.extendedLikesInfo = {
      likesCount: postData.likesCount,
      dislikesCount: postData.dislikesCount,
      myStatus: postData.myStatus,
      newestLikes: postData.newestLikes,
    };

    return dto;
  }
}
