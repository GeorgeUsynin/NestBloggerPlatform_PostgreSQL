import { DeletionStatus, Post, PostModelType } from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostViewDto } from '../api/dto/view-dto/posts.view-dto';
import { FilterQuery } from 'mongoose';
import { Blog } from '../domain/blog.entity';
import { Like, LikeModelType } from '../domain/like.entity';
import { BlogModelType } from '../domain/blog.entity';
import { User, UserModelType } from '../../user-accounts/domain/user.entity';
import { GetPostsQueryParams } from '../api/dto/query-params-dto/get-posts-query-params.input-dto';
import { LikeStatus } from '../types';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async getAllPosts(
    query: GetPostsQueryParams,
    userId: string | null,
    blogId?: string,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const filter: FilterQuery<Post> = {
      deletionStatus: DeletionStatus.NotDeleted,
      ...(blogId && { blogId }),
    };

    const items = await this.findPostItemsByParamsAndFilter(query, filter);
    const totalCount = await this.getTotalCountOfFilteredPosts(filter);

    const postsIds = items.map((item) => item._id.toString());
    const likes = await this.LikeModel.find({
      parentId: { $in: postsIds },
      userId,
    });

    const mappedItems = items.map(async (item) => {
      let myStatus: LikeStatus = LikeStatus.None;

      if (likes.length > 0) {
        const like = likes.find(
          (like) => like.parentId === item._id.toString(),
        );
        myStatus = like ? like.status : LikeStatus.None;
      }

      const newestLikes = await this.getNewestLikes(item._id.toString());

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
    userId: string | null,
    blogId: string,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const blog = await this.BlogModel.findById(blogId);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return this.getAllPosts(query, userId, blogId);
  }

  async getByIdOrNotFoundFail(
    id: string,
    userId: string | null,
  ): Promise<PostViewDto> {
    const post = await this.PostModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    }).exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let myStatus: LikeStatus = LikeStatus.None;

    if (userId) {
      const like = await this.LikeModel.findOne({
        parentId: post._id.toString(),
        userId,
      });
      myStatus = like ? like.status : LikeStatus.None;
    }

    const newestLikes = await this.getNewestLikes(id);

    return PostViewDto.mapToView(post, myStatus, newestLikes);
  }

  async findPostItemsByParamsAndFilter(
    query: GetPostsQueryParams,
    filter: FilterQuery<Post>,
  ) {
    const { sortBy, sortDirection, pageSize } = query;

    return this.PostModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(query.calculateSkip())
      .limit(pageSize);
  }

  async getTotalCountOfFilteredPosts(filter: FilterQuery<Post>) {
    return this.PostModel.countDocuments(filter);
  }

  private async getNewestLikes(postId: string) {
    const newestLikesRaw = await this.LikeModel.find({
      parentId: postId,
      status: LikeStatus.Like,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    const likesUsersIds = newestLikesRaw.map((like) => like.userId);
    const users = await this.UserModel.find({ _id: { $in: likesUsersIds } });

    const newestLikes = newestLikesRaw.map((like) => {
      const user = users.find((user) => user._id.toString() === like.userId);
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
