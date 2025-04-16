import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import {
  NewestLikesDto,
  PostViewDto,
} from '../api/dto/view-dto/posts.view-dto';
import { GetPostsQueryParams } from '../api/dto/query-params-dto/get-posts-query-params.input-dto';
import { Like, LikeStatus, ParentType } from '../domain/like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { Post } from '../domain/post.entity';
import { Blog } from '../domain/blog.entity';

export class EnrichedPost extends Post {
  like: Like | null;
}

class PostsLikesDislikesInfo {
  likesCount: number;
  dislikesCount: number;
}

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
    const postsQueryBuilder = await this.createPostsQueryBuilderByQueryParams(
      query,
      blogId,
    );

    const totalCountPromise = await postsQueryBuilder.getCount();

    const postsPromise = (await postsQueryBuilder
      .clone()
      .leftJoinAndMapOne(
        'post.like',
        'Likes',
        'like',
        'like.parentId = post.id AND like.parentType = :parentType AND like.userId = :userId',
        { parentType: ParentType.post, userId },
      )
      .getMany()) as EnrichedPost[];

    const postsLikesDislikesPromise = await postsQueryBuilder
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
        'like.parentId = post.id AND like.parentType = :parentType',
        {
          parentType: ParentType.post,
        },
      )
      .groupBy('post.id')
      .setParameters({
        like: LikeStatus.Like,
        dislike: LikeStatus.Dislike,
      })
      .getRawMany<PostsLikesDislikesInfo>();

    const [totalCount, posts, postsLikesDislikes] = await Promise.all([
      totalCountPromise,
      postsPromise,
      postsLikesDislikesPromise,
    ]);

    const newestLikes: NewestLikesDto[][] = await Promise.all(
      posts.map((post) => post.id).map(this.getNewestLikes.bind(this)),
    );

    return PaginatedViewDto.mapToView({
      items: posts.map((post, idx) =>
        PostViewDto.mapToView({
          ...post,
          ...postsLikesDislikes[idx],
          myStatus: post.like?.status || LikeStatus.None,
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

  async createPostsQueryBuilderByQueryParams(
    query: GetPostsQueryParams,
    blogId?: number,
  ): Promise<SelectQueryBuilder<Post>> {
    const { sortBy, sortDirection, pageSize } = query;

    const builder = this.postsRepository
      .createQueryBuilder('post')
      .orderBy(`post.${sortBy}`, sortDirection.toUpperCase() as 'ASC' | 'DESC')
      .offset(query.calculateSkip())
      .limit(pageSize);

    if (blogId) {
      builder.where('post."blogId" = :blogId', { blogId });
    }

    return builder;
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
