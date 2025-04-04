import { Injectable } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { CommentViewDto } from '../api/dto/view-dto/comments.view-dto';
import { GetCommentsQueryParams } from '../api/dto/query-params-dto/get-comments-query-params.input-dto';
import { LikeStatus, ParentType } from '../types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { DBComment, DBPost } from './types';

class DBCommentWithLoginAndMyStatus extends DBComment {
  userLogin: string;
  myStatus: LikeStatus;
}

class CommentsLikesDislikesInfo {
  likesCount: number;
  dislikesCount: number;
}

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllCommentsByPostId(
    query: GetCommentsQueryParams,
    postId: number,
    userId: number | null,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const post: DBPost | null =
      (
        await this.dataSource.query(
          `
          SELECT * FROM "Posts"
          WHERE id = $1 AND "deletedAt" IS NULL;
        `,
          [postId],
        )
      )[0] ?? null;

    if (!post) {
      throw NotFoundDomainException.create('Post not found');
    }

    // TODO: Refactor with dynamic query and filter!
    const [items, totalCount] = await Promise.all([
      this.findCommentItemsByQueryParams(query, post.id),
      this.getTotalCommentsCount(post.id),
    ]);

    const commentsIds = items.map((item) => item.id);
    const comments: DBCommentWithLoginAndMyStatus[] =
      await this.dataSource.query(
        `
        SELECT
            c.*, 
            u."login" AS "userLogin", 
            COALESCE(l."status", 'None') AS "myStatus"
        FROM "Comments" as c
        LEFT JOIN "Users" AS u 
            ON c."userId" = u."id"
        LEFT JOIN "Likes" AS l 
            ON l."parentId" = c."id"
            AND l."parentType" = $3
            AND l."userId" = $2
        WHERE c.id = ANY($1) 
            AND c."deletedAt" IS NULL
        ORDER BY array_position($1, c.id);
        `,
        [commentsIds, userId, ParentType.comment],
      );

    const commentLikesDislikes: CommentsLikesDislikesInfo[] =
      await this.dataSource.query(
        `
        SELECT 
            COALESCE(COUNT(l.*) FILTER (WHERE l.status = 'Like')::int, 0) AS "likesCount",
            COALESCE(COUNT(l.*) FILTER (WHERE l.status = 'Dislike')::int, 0) AS "dislikesCount"
        FROM UNNEST($1::int[]) AS c("id")  -- Разворачиваем список комментариев
        LEFT JOIN "Likes" l
        ON l."parentId" = c.id AND l."parentType" = $2
        GROUP BY c.id
        ORDER BY array_position($1, c.id);
        `,
        [commentsIds, ParentType.comment],
      );

    return PaginatedViewDto.mapToView({
      items: comments.map((comment, idx) =>
        CommentViewDto.mapToView({ ...comment, ...commentLikesDislikes[idx] }),
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
    const comment: DBCommentWithLoginAndMyStatus | null =
      (
        await this.dataSource.query(
          `
          SELECT 
              c.*, 
              u."login" AS "userLogin", 
              COALESCE(l."status", 'None') AS "myStatus"
          FROM "Comments" AS c
          LEFT JOIN "Users" AS u 
              ON c."userId" = u.id
          LEFT JOIN "Likes" AS l 
              ON l."parentId" = c.id
              AND l."parentType" = $3
              AND l."userId" = $2
          WHERE c.id = $1 
              AND c."deletedAt" IS NULL;
          `,
          [commentId, userId, ParentType.comment],
        )
      )[0] ?? null;

    if (!comment) {
      throw NotFoundDomainException.create('Comment not found');
    }

    const [{ likesCount, dislikesCount }]: [CommentsLikesDislikesInfo] =
      await this.dataSource.query(
        `
        SELECT
            COALESCE(COUNT(*) FILTER (WHERE status = 'Like')::int, 0) AS "likesCount",
            COALESCE(COUNT(*) FILTER (WHERE status = 'Dislike')::int, 0) AS "dislikesCount"
        FROM "Likes"
        WHERE "parentId" = $1
            AND "parentType" = $2
        `,
        [commentId, ParentType.comment],
      );

    return CommentViewDto.mapToView({
      ...comment,
      likesCount,
      dislikesCount,
    });
  }

  async findCommentItemsByQueryParams(
    query: GetCommentsQueryParams,
    postId: number,
  ): Promise<DBComment[]> {
    const { sortBy, sortDirection, pageSize } = query;

    return this.dataSource.query(
      `
      SELECT * FROM "Comments" as c
      WHERE c."postId" = $1 AND c."deletedAt" IS NULL
      ORDER BY c."${sortBy}" ${sortDirection}
      LIMIT $2 OFFSET $3
      `,
      [postId, pageSize, query.calculateSkip()],
    );
  }

  async getTotalCommentsCount(postId: number): Promise<number> {
    const { count } = (
      await this.dataSource.query(
        `
        SELECT COUNT(*)::int FROM "Comments" as c
        WHERE c."postId" = $1 AND c."deletedAt" IS NULL;
        `,
        [postId],
      )
    )[0];

    return count;
  }
}
