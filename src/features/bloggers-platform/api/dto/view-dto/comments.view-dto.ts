import { SchemaTimestampsConfig } from 'mongoose';
import { LikeStatus } from '../../../types';
import { CommentDocument } from '../../../domain/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

class CommentatorInfo {
  @ApiProperty({ type: Number })
  userId: number;

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
  createdAt: SchemaTimestampsConfig['createdAt'];

  @ApiProperty({ type: LikesInfo })
  likesInfo: LikesInfo;

  static mapToView(
    comment: CommentDocument,
    myStatus: LikeStatus,
  ): CommentViewDto {
    const dto = new CommentViewDto();

    dto.id = comment._id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = comment.commentatorInfo;
    dto.createdAt = comment.createdAt;
    dto.likesInfo = {
      dislikesCount: comment.likesInfo.dislikesCount,
      likesCount: comment.likesInfo.likesCount,
      myStatus,
    };

    return dto;
  }
}
