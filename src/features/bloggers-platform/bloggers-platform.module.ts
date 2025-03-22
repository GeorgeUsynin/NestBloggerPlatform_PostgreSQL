import { Module } from '@nestjs/common';
import { UsersAccountsModule } from '../user-accounts/usersAccounts.module';
import { BlogsSAController } from './api/blogs-sa.controller';
import { BlogsController } from './api/blogs.controller';
import { PostsController } from './api/posts.controller';
import { BlogsQueryRepository } from './infrastructure/blogs.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blog.entity';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { PostsQueryRepository } from './infrastructure/posts.query-repository';
import { CommentsController } from './api/comments.controller';
import { CommentsQueryRepository } from './infrastructure/comments.query-repository';
import { Post, PostSchema } from './domain/post.entity';
import { Comment, CommentSchema } from './domain/comment.entity';
import { LikeSchema, Like } from './domain/like.entity';
import { PostsRepository } from './infrastructure/posts.repository';
import { CommentsRepository } from './infrastructure/comments.repository';
import { LikesRepository } from './infrastructure/likes.repository';
import { BlogIsExistConstraint } from './api/validate/blog-is-exist.decorator';
import {
  CreateBlogUseCase,
  CreatePostUseCase,
  DeleteBlogUseCase,
  UpdateBlogUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  CreateCommentUseCase,
  UpdatePostByBlogIdAndPostIdUseCase,
  DeletePostByBlogIdAndPostIdUseCase,
  UpdateLikePostStatusUseCase,
  UpdateLikeCommentStatusUseCase,
} from './application/use-cases';

const mongooseModels = [
  { name: Blog.name, schema: BlogSchema },
  { name: Post.name, schema: PostSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: Like.name, schema: LikeSchema },
];

const controllers = [
  BlogsController,
  BlogsSAController,
  PostsController,
  CommentsController,
];

const useCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  UpdatePostByBlogIdAndPostIdUseCase,
  DeletePostByBlogIdAndPostIdUseCase,
  UpdateLikePostStatusUseCase,
  UpdateLikeCommentStatusUseCase,
];
const repositories = [
  BlogsRepository,
  PostsRepository,
  CommentsRepository,
  LikesRepository,
];
const queryRepositories = [
  BlogsQueryRepository,
  PostsQueryRepository,
  CommentsQueryRepository,
];

@Module({
  // This will allow injecting models into the providers in this module
  imports: [MongooseModule.forFeature(mongooseModels), UsersAccountsModule],
  controllers: [...controllers],
  providers: [
    ...repositories,
    ...queryRepositories,
    ...useCases,
    BlogIsExistConstraint,
  ],
  exports: [MongooseModule],
  /* We re-export the MongooseModule if we want the models registered here to be injectable 
  into the services of other modules that import this module */
})
export class BloggersPlatformModule {}
