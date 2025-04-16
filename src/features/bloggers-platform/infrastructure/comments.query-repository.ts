import { Injectable } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { CommentViewDto } from '../api/dto/view-dto/comments.view-dto';
import { GetCommentsQueryParams } from '../api/dto/query-params-dto/get-comments-query-params.input-dto';
import { Like, LikeStatus, ParentType } from '../domain/like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { Comment } from '../domain/comment.entity';
import { User } from '../../user-accounts/domain/user.entity';
import { Post } from '../domain/post.entity';

export class EnrichedComment extends Comment {
  user: User;
  like: Like | null;
}

class CommentLikesDislikesInfo {
  likesCount: number;
  dislikesCount: number;
}

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}
  async getAllCommentsByPostId(
    query: GetCommentsQueryParams,
    postId: number,
    userId: number | null,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const post: Post | null = await this.postsRepository.findOneBy({
      id: postId,
    });

    if (!post) {
      throw NotFoundDomainException.create('Post not found');
    }

    const commentsQueryBuilder =
      await this.createCommentsQueryBuilderByQueryParams(query, postId);

    const totalCountPromise = commentsQueryBuilder.getCount();

    const commentsPromise = commentsQueryBuilder
      .clone()
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndMapOne(
        'comment.like',
        'Likes',
        'like',
        'like.parentId = comment.id AND like.parentType = :parentType AND like.userId = :userId',
        { parentType: ParentType.comment, userId },
      )
      .getMany() as Promise<EnrichedComment[]>;

    const commentsLikesDislikesPromise = commentsQueryBuilder
      .clone()
      .select(
        `COALESCE(SUM(CASE WHEN like.status = :like THEN 1 ELSE 0 END)::int, 0)`,
        'likesCount',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN like.status = :dislike THEN 1 ELSE 0 END)::int, 0)`,
        'dislikesCount',
      )
      .leftJoin(
        'Likes',
        'like',
        'like.parentId = comment.id AND like.parentType = :parentType',
        {
          parentType: ParentType.comment,
        },
      )
      .groupBy('comment.id')
      .setParameters({
        like: LikeStatus.Like,
        dislike: LikeStatus.Dislike,
      })
      .getRawMany<CommentLikesDislikesInfo>();

    const [totalCount, comments, commentsLikesDislikes] = await Promise.all([
      totalCountPromise,
      commentsPromise,
      commentsLikesDislikesPromise,
    ]);

    return PaginatedViewDto.mapToView({
      items: comments.map((comment, idx) =>
        CommentViewDto.mapToView({
          content: comment.content,
          createdAt: comment.createdAt,
          id: comment.id,
          myStatus: comment.like?.status || LikeStatus.None,
          userId: comment.user.id,
          userLogin: comment.user.login,
          ...commentsLikesDislikes[idx],
        }),
      ),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async getByIdOrNotFoundFail(
    commentId: number,
    userId: number | null,
  ): Promise<CommentViewDto> {
    const comment = (await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndMapOne(
        'comment.like',
        'Likes',
        'like',
        'like.parentId = comment.id AND like.parentType = :parentType AND like.userId = :userId',
        { parentType: ParentType.comment, userId },
      )
      .where('comment.id = :commentId', { commentId })
      .getOne()) as EnrichedComment | null;

    if (!comment) {
      throw NotFoundDomainException.create('Comment not found');
    }

    const { likesCount, dislikesCount } = (await this.likesRepository
      .createQueryBuilder('like')
      .select(
        `COALESCE(SUM(CASE WHEN like.status = :like THEN 1 ELSE 0 END)::int, 0)`,
        'likesCount',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN like.status = :dislike THEN 1 ELSE 0 END)::int, 0)`,
        'dislikesCount',
      )
      .where('like.parentId = :parentId', { parentId: commentId })
      .andWhere('like.parentType = :parentType', {
        parentType: ParentType.comment,
        like: LikeStatus.Like,
        dislike: LikeStatus.Dislike,
      })
      .getRawOne<{ likesCount: number; dislikesCount: number }>())!;

    return CommentViewDto.mapToView({
      content: comment.content,
      createdAt: comment.createdAt,
      id: comment.id,
      myStatus: comment.like?.status || LikeStatus.None,
      userId: comment.user.id,
      userLogin: comment.user.login,
      likesCount,
      dislikesCount,
    });
  }

  async createCommentsQueryBuilderByQueryParams(
    query: GetCommentsQueryParams,
    postId: number,
  ): Promise<SelectQueryBuilder<Comment>> {
    const { sortBy, sortDirection, pageSize } = query;

    const builder = this.commentsRepository
      .createQueryBuilder('comment')
      .where('comment.postId = :postId', { postId })
      .orderBy(
        `comment.${sortBy}`,
        sortDirection.toUpperCase() as 'ASC' | 'DESC',
      )
      .offset(query.calculateSkip())
      .limit(pageSize);

    return builder;
  }
}
