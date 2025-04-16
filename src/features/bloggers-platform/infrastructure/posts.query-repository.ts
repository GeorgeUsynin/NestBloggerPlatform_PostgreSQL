import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import {
  NewestLikesDto,
  PostViewDto,
} from '../api/dto/view-dto/posts.view-dto';
import { GetPostsQueryParams } from '../api/dto/query-params-dto/get-posts-query-params.input-dto';
import { Like, LikeStatus, ParentType } from '../domain/like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { Post } from '../domain/post.entity';
import { Blog } from '../domain/blog.entity';

export class EnrichedPost extends Post {
  like: Like | null;
}
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
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async getAllPosts(
    query: GetPostsQueryParams,
    userId: number | null,
    blogId?: number,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const [posts, totalCount] =
      await this.findPostItemsAndTotalCountByQueryParams(query, blogId);

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
    const post = (await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndMapOne(
        'post.like',
        'Likes',
        'like',
        'like.parentId = post.id AND like.parentType = :parentType AND like.userId = :userId',
        { parentType: ParentType.post, userId },
      )
      .where('post.id = :postId', { postId })
      .getOne()) as EnrichedPost | null;

    if (!post) {
      throw NotFoundDomainException.create('Post not found');
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
      .where('like.parentId = :parentId', { parentId: postId })
      .andWhere('like.parentType = :parentType', {
        parentType: ParentType.post,
        like: LikeStatus.Like,
        dislike: LikeStatus.Dislike,
      })
      .getRawOne<{ likesCount: number; dislikesCount: number }>())!;

    const newestLikes = await this.getNewestLikes(postId);

    return PostViewDto.mapToView({
      ...post,
      myStatus: post.like?.status || LikeStatus.None,
      likesCount,
      dislikesCount,
      newestLikes,
    });
  }

  async findPostItemsAndTotalCountByQueryParams(
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

  private async getNewestLikes(postId: number) {
    const newestLikes = await this.likesRepository
      .createQueryBuilder('like')
      .select('like.createdAt', 'addedAt')
      .addSelect('"like"."userId"::text', 'userId')
      .addSelect('"user".login', 'login')
      .leftJoin('Users', 'user', 'like.userId = user.id')
      .where('like.parentId = :parentId', { parentId: postId })
      .andWhere('like.status = :status', { status: LikeStatus.Like })
      .orderBy('like.createdAt', 'DESC')
      .limit(3)
      .getRawMany<NewestLikesDto>();

    return newestLikes;
  }
}
