import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostViewDto } from '../api/dto/view-dto/posts.view-dto';
import { GetPostsQueryParams } from '../api/dto/query-params-dto/get-posts-query-params.input-dto';
import { LikeStatus } from '../types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { Post } from '../domain/post.entity';
import { Blog } from '../domain/blog.entity';

// class DBPostWitMyStatus extends DBPost {
//   myStatus: LikeStatus;
// }

// class PostsLikesDislikesInfo {
//   likesCount: number;
//   dislikesCount: number;
// }

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async getAllPosts(
    query: GetPostsQueryParams,
    userId: number | null,
    blogId?: number,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const [posts, totalCount] =
      await this.findPostItemsAntTotalCountByQueryParams(query, blogId);

    // const postsIds = items.map((item) => item.id);

    // const posts: DBPostWitMyStatus[] = await this.dataSource.query(
    //   `
    //     SELECT
    //         p.*,
    //         COALESCE(l."status", 'None') AS "myStatus"
    //     FROM "Posts" as p
    //     LEFT JOIN "Likes" AS l
    //         ON l."parentId" = p."id"
    //         AND l."parentType" = $3
    //         AND l."userId" = $2
    //     WHERE p.id = ANY($1)
    //         AND p."deletedAt" IS NULL
    //     ORDER BY array_position($1, p.id);
    //     `,
    //   [postsIds, userId, ParentType.post],
    // );

    // const postLikesDislikes: PostsLikesDislikesInfo[] =
    //   await this.dataSource.query(
    //     `
    //   SELECT
    //       COALESCE(COUNT(l.*) FILTER (WHERE l.status = 'Like')::int, 0) AS "likesCount",
    //       COALESCE(COUNT(l.*) FILTER (WHERE l.status = 'Dislike')::int, 0) AS "dislikesCount"
    //   FROM UNNEST($1::int[]) AS p("id")  -- Разворачиваем список комментариев
    //   LEFT JOIN "Likes" l
    //   ON l."parentId" = p.id AND l."parentType" = $2
    //   GROUP BY p.id
    //   ORDER BY array_position($1, p.id);
    //   `,
    //     [postsIds, ParentType.post],
    //   );

    // const newestLikes: NewestLikesDto[][] = await Promise.all(
    //   postsIds.map(this.getNewestLikes.bind(this)),
    // );

    return PaginatedViewDto.mapToView({
      items: posts.map((post) =>
        PostViewDto.mapToView({
          ...post,
          myStatus: LikeStatus.None,
          dislikesCount: 0,
          likesCount: 0,
          newestLikes: [],
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
    const blog = await this.blogsRepository.findOneBy({ id: blogId });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return this.getAllPosts(query, userId, blogId);
  }

  async getByIdOrNotFoundFail(
    postId: number,
    userId: number | null,
  ): Promise<PostViewDto> {
    const post = await this.postsRepository.findOneBy({ id: postId });

    if (!post) {
      throw NotFoundDomainException.create('Post not found');
    }

    // const [{ likesCount, dislikesCount }]: [PostsLikesDislikesInfo] =
    //   await this.dataSource.query(
    //     `
    //     SELECT
    //         COALESCE(COUNT(*) FILTER (WHERE status = 'Like')::int, 0) AS "likesCount",
    //         COALESCE(COUNT(*) FILTER (WHERE status = 'Dislike')::int, 0) AS "dislikesCount"
    //     FROM "Likes"
    //     WHERE "parentId" = $1
    //         AND "parentType" = $2
    //     `,
    //     [postId, ParentType.post],
    //   );

    // const newestLikes = await this.getNewestLikes(postId);

    return PostViewDto.mapToView({
      ...post,
      myStatus: LikeStatus.None,
      likesCount: 0,
      dislikesCount: 0,
      newestLikes: [],
    });
  }

  async findPostItemsAntTotalCountByQueryParams(
    query: GetPostsQueryParams,
    blogId?: number,
  ): Promise<[Post[], number]> {
    const { sortBy, sortDirection, pageSize } = query;

    const builder = this.postsRepository
      .createQueryBuilder('post')
      .orderBy(`post.${sortBy}`, sortDirection.toUpperCase() as 'ASC' | 'DESC')
      .offset(query.calculateSkip())
      .limit(pageSize);

    if (blogId) {
      builder.where('post."blogId" = :blogId', { blogId });
    }

    return await builder.getManyAndCount();
  }

  // private async getNewestLikes(postId: number) {
  //   const newestLikes: NewestLikesDto[] = await this.dataSource.query(
  //     `
  //     SELECT
  //         l."createdAt" AS "addedAt",
  //         l."userId"::TEXT AS "userId",
  //         u.login
  //     FROM "Likes" AS l
  //     LEFT JOIN "Users" AS u
  //     ON l."userId" = u.id
  //     WHERE "parentId" = $1 AND status = $2
  //     ORDER BY l."createdAt" DESC
  //     LIMIT 3
  //     `,
  //     [postId, LikeStatus.Like],
  //   );

  //   return newestLikes;
  // }
}
