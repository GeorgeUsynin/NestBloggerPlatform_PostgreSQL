import { LikeStatus } from '../../../types';
import { ApiProperty } from '@nestjs/swagger';
import { DBComment } from '../../../infrastructure/types';
import { User } from '../../../../user-accounts/domain/user.entity';

class MapViewCommentData {
  id: DBComment['id'];
  content: DBComment['content'];
  userId: User['id'];
  userLogin: User['login'];
  createdAt: DBComment['createdAt'];
  myStatus: LikeStatus;
  dislikesCount: number;
  likesCount: number;
}

class CommentatorInfo {
  @ApiProperty({ type: Number })
  userId: string;

  @ApiProperty({ type: String })
  userLogin: string;
}

class LikesInfo {
  @ApiProperty({ type: Number, description: 'Total likes for parent item' })
  likesCount: number;

  @ApiProperty({ type: Number, description: 'Total dislikes for parent item' })
  dislikesCount: number;

  @ApiProperty({
    enum: LikeStatus,
    description: 'Send None if you want to unlike\/undislike',
  })
  myStatus: LikeStatus;
}

export class CommentViewDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({ type: CommentatorInfo })
  commentatorInfo: CommentatorInfo;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: LikesInfo })
  likesInfo: LikesInfo;

  static mapToView(commentData: MapViewCommentData): CommentViewDto {
    const dto = new CommentViewDto();

    dto.id = commentData.id.toString();
    dto.content = commentData.content;
    dto.commentatorInfo = {
      userId: commentData.userId.toString(),
      userLogin: commentData.userLogin,
    };
    dto.createdAt = commentData.createdAt;
    dto.likesInfo = {
      likesCount: commentData.likesCount,
      dislikesCount: commentData.dislikesCount,
      myStatus: commentData.myStatus,
    };

    return dto;
  }
}
