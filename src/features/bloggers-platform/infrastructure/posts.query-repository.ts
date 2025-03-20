import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostViewDto } from '../api/dto/view-dto/posts.view-dto';
import { Like, LikeModelType } from '../domain/like.entity';
import { User, UserModelType } from '../../user-accounts/domain/user.entity';
import { GetPostsQueryParams } from '../api/dto/query-params-dto/get-posts-query-params.input-dto';
import { LikeStatus } from '../types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DBPost } from './types';
import { BlogsRepository } from './blogs.repository';

@Injectable()
export class PostsQueryRepository {
  constructor(
    private blogsRepository: BlogsRepository,
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
    @InjectModel(User.name)
    private UserModel: UserModelType,
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
      this.getTotalPostCount(blogId),
    ]);

    const mappedItems = items.map(async (item) => {
      const myStatus: LikeStatus = LikeStatus.None;

      const newestLikes = [];

      return PostViewDto.mapToView(item, myStatus, newestLikes);
    });

    return PaginatedViewDto.mapToView({
      items: await Promise.all(mappedItems),
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
    id: number,
    userId: number | null,
  ): Promise<PostViewDto> {
    const post: DBPost = (
      await this.dataSource.query(
        `
      SELECT * FROM "Posts"
      WHERE id = $1 AND "deletedAt" IS NULL;
      `,
        [id],
      )
    )[0];

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const myStatus: LikeStatus = LikeStatus.None;

    const newestLikes = [];

    return PostViewDto.mapToView(post, myStatus, newestLikes);
  }

  async findPostItemsByQueryParams(
    query: GetPostsQueryParams,
    blogId?: number,
  ) {
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

  async getTotalPostCount(blogId?: number) {
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
    const newestLikesRaw = await this.LikeModel.find({
      parentId: postId,
      status: LikeStatus.Like,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    const likesUsersIds = newestLikesRaw.map((like) => like.userId);
    const users = await this.UserModel.find({ _id: { $in: likesUsersIds } });

    const newestLikes = newestLikesRaw.map((like) => {
      const user = users.find((user) => user.id === like.userId);
      return {
        addedAt: like.createdAt as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        login: user?.login!,
        userId: like.userId,
      };
    });

    return newestLikes;
  }
}
