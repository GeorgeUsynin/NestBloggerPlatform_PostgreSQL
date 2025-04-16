import { Module } from '@nestjs/common';
import { UsersAccountsModule } from '../user-accounts/usersAccounts.module';
import { BlogsSAController } from './api/blogs-sa.controller';
import { BlogsController } from './api/blogs.controller';
import { PostsController } from './api/posts.controller';
import { BlogsQueryRepository } from './infrastructure/blogs.query-repository';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { PostsQueryRepository } from './infrastructure/posts.query-repository';
import { CommentsController } from './api/comments.controller';
import { CommentsQueryRepository } from './infrastructure/comments.query-repository';
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
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { Post } from './domain/post.entity';
import { Comment } from './domain/comment.entity';
import { Like } from './domain/like.entity';

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
  imports: [
    UsersAccountsModule,
    TypeOrmModule.forFeature([Blog, Post, Comment, Like]),
  ],
  controllers: [...controllers],
  providers: [
    ...repositories,
    ...queryRepositories,
    ...useCases,
    BlogIsExistConstraint,
  ],
  exports: [
    BlogsRepository,
    PostsRepository,
    CommentsRepository,
    LikesRepository,
  ],
})
export class BloggersPlatformModule {}
