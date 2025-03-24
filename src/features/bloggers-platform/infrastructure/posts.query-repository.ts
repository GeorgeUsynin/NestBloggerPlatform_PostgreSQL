import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import {
  NewestLikesDto,
  PostViewDto,
} from '../api/dto/view-dto/posts.view-dto';
import { GetPostsQueryParams } from '../api/dto/query-params-dto/get-posts-query-params.input-dto';
import { LikeStatus, ParentType } from '../types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DBPost } from './types';
import { BlogsRepository } from './blogs.repository';

class DBPostWitMyStatus extends DBPost {
  myStatus: LikeStatus;
}

class PostsLikesDislikesInfo {
  likesCount: number;
  dislikesCount: number;
}

@Injectable()
export class PostsQueryRepository {
  constructor(
    private blogsRepository: BlogsRepository,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async getAllPosts(
    query: GetPostsQueryParams,
    userId: number | null,
    blogId?: number,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    // TODO: Refactor with dynamic query and filter!
    const [items, totalCount] = await Promise.all([
      this.findPostItemsByQueryParams(query, blogId),
      this.getTotalPostsCount(blogId),
    ]);

    const postsIds = items.map((item) => item.id);

    const posts: DBPostWitMyStatus[] = await this.dataSource.query(
      `
        SELECT
            p.*, 
            COALESCE(l."status", 'None') AS "myStatus"
        FROM "Posts" as p
        LEFT JOIN "Likes" AS l 
            ON l."parentId" = p."id"
            AND l."parentType" = $3
            AND l."userId" = $2
        WHERE p.id = ANY($1) 
            AND p."deletedAt" IS NULL
        ORDER BY array_position($1, p.id);
        `,
      [postsIds, userId, ParentType.post],
    );

    const postLikesDislikes: PostsLikesDislikesInfo[] =
      await this.dataSource.query(
        `
      SELECT 
          COALESCE(COUNT(l.*) FILTER (WHERE l.status = 'Like')::int, 0) AS "likesCount",
          COALESCE(COUNT(l.*) FILTER (WHERE l.status = 'Dislike')::int, 0) AS "dislikesCount"
      FROM UNNEST($1::int[]) AS p("id")  -- Разворачиваем список комментариев
      LEFT JOIN "Likes" l
      ON l."parentId" = p.id AND l."parentType" = $2
      GROUP BY p.id
      ORDER BY array_position($1, p.id);
      `,
        [postsIds, ParentType.post],
      );

    const newestLikes: NewestLikesDto[][] = await Promise.all(
      postsIds.map(this.getNewestLikes.bind(this)),
    );

    return PaginatedViewDto.mapToView({
      items: posts.map((post, idx) =>
        PostViewDto.mapToView({
          ...post,
          ...postLikesDislikes[idx],
          newestLikes: newestLikes[idx],
        }),
      ),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async getAllPostsByBlogId(
    query: GetPostsQueryParams,
    userId: number | null,
    blogId: number,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const blog = await this.blogsRepository.findBlogById(blogId);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return this.getAllPosts(query, userId, blogId);
  }

  async getByIdOrNotFoundFail(
    postId: number,
    userId: number | null,
  ): Promise<PostViewDto> {
    const post: DBPostWitMyStatus =
      (
        await this.dataSource.query(
          `
          SELECT 
              p.*, 
              COALESCE(l."status", 'None') AS "myStatus"
          FROM "Posts" AS p
          LEFT JOIN "Likes" AS l 
              ON l."parentId" = p.id
              AND l."parentType" = $3
              AND l."userId" = $2
          WHERE p.id = $1
              AND p."deletedAt" IS NULL
          `,
          [postId, userId, ParentType.post],
        )
      )[0] ?? null;

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const [{ likesCount, dislikesCount }]: [PostsLikesDislikesInfo] =
      await this.dataSource.query(
        `
        SELECT
            COALESCE(COUNT(*) FILTER (WHERE status = 'Like')::int, 0) AS "likesCount",
            COALESCE(COUNT(*) FILTER (WHERE status = 'Dislike')::int, 0) AS "dislikesCount"
        FROM "Likes"
        WHERE "parentId" = $1
            AND "parentType" = $2
        `,
        [postId, ParentType.post],
      );

    const newestLikes = await this.getNewestLikes(postId);

    return PostViewDto.mapToView({
      ...post,
      likesCount,
      dislikesCount,
      newestLikes,
    });
  }

  async findPostItemsByQueryParams(
    query: GetPostsQueryParams,
    blogId?: number,
  ): Promise<DBPost[]> {
    const { sortBy, sortDirection, pageSize } = query;

    if (blogId) {
      return this.dataSource.query(
        `
        SELECT * FROM "Posts" as p
        WHERE p."deletedAt" IS NULL
        AND p."blogId" = $1
        ORDER BY p."${sortBy}" ${sortDirection}
        LIMIT $2 OFFSET $3
        `,
        [blogId, pageSize, query.calculateSkip()],
      );
    } else {
      return this.dataSource.query(
        `
        SELECT * FROM "Posts" as p
        WHERE p."deletedAt" IS NULL
        ORDER BY p."${sortBy}" ${sortDirection}
        LIMIT $1 OFFSET $2
        `,
        [pageSize, query.calculateSkip()],
      );
    }
  }

  async getTotalPostsCount(blogId?: number): Promise<number> {
    if (blogId) {
      const { count } = (
        await this.dataSource.query(
          `
        SELECT COUNT(*)::int FROM "Posts" as p
        WHERE p."deletedAt" IS NULL
        AND p."blogId" = $1
        `,
          [blogId],
        )
      )[0];

      return count;
    } else {
      const { count } = (
        await this.dataSource.query(
          `
        SELECT COUNT(*)::int FROM "Posts" as p
        WHERE p."deletedAt" IS NULL
        `,
        )
      )[0];

      return count;
    }
  }

  private async getNewestLikes(postId: number) {
    const newestLikes: NewestLikesDto[] = await this.dataSource.query(
      `
      SELECT
          l."createdAt" AS "addedAt",
          l."userId"::TEXT AS "userId",
          u.login
      FROM "Likes" AS l
      LEFT JOIN "Users" AS u
      ON l."userId" = u.id
      WHERE "parentId" = $1 AND status = $2
      ORDER BY l."createdAt" DESC
      LIMIT 3
      `,
      [postId, LikeStatus.Like],
    );

    return newestLikes;
  }
}
