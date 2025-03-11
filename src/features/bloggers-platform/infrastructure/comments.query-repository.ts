import { DeletionStatus, Post, PostModelType } from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { CommentViewDto } from '../api/dto/view-dto/comments.view-dto';
import { GetCommentsQueryParams } from '../api/dto/query-params-dto/get-comments-query-params.input-dto';
import { FilterQuery } from 'mongoose';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { Like, LikeModelType } from '../domain/like.entity';
import { LikeStatus } from '../types';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
  ) {}

  async getAllCommentsByPostId(
    query: GetCommentsQueryParams,
    postId: string,
    userId: string | null,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const post = await this.PostModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const filter: FilterQuery<Comment> = {
      postId,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    };

    const items = await this.findCommentItemsByParamsAndFilter(query, filter);
    const totalCount = await this.getTotalCountOfFilteredComments(filter);

    const commentsIds = items.map((item) => item._id.toString());
    const likes = await this.LikeModel.find({
      parentId: { $in: commentsIds },
      userId,
    });

    return PaginatedViewDto.mapToView({
      items: items.map((item) => {
        let myStatus: LikeStatus = LikeStatus.None;

        if (likes.length > 0) {
          const like = likes.find(
            (like) => like.parentId === item._id.toString(),
          );
          myStatus = like ? like.status : LikeStatus.None;
        }

        return CommentViewDto.mapToView(item, myStatus);
      }),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async getByIdOrNotFoundFail(
    commentId: string,
    userId: string | null,
  ): Promise<CommentViewDto> {
    const comment = await this.CommentModel.findOne({
      _id: commentId,
      deletionStatus: DeletionStatus.NotDeleted,
    }).exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    let myStatus: LikeStatus = LikeStatus.None;

    if (userId) {
      const like = await this.LikeModel.findOne({
        parentId: comment._id.toString(),
        userId,
      });
      myStatus = like ? like.status : LikeStatus.None;
    }

    return CommentViewDto.mapToView(comment, myStatus);
  }

  async findCommentItemsByParamsAndFilter(
    query: GetCommentsQueryParams,
    filter: FilterQuery<Comment>,
  ) {
    const { sortBy, sortDirection, pageSize } = query;

    return this.CommentModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(query.calculateSkip())
      .limit(pageSize);
  }

  async getTotalCountOfFilteredComments(filter: FilterQuery<Comment>) {
    return this.CommentModel.countDocuments(filter);
  }
}
