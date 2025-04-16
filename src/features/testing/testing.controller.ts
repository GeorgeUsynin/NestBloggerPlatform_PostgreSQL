import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TestingAllDataApi } from './swagger/testing-all-data.decorator';
import { UsersRepository } from '../user-accounts/infrastructure/users.repository';
import { AuthDeviceSessionsRepository } from '../user-accounts/infrastructure/authDeviceSessions.repository';
import { BlogsRepository } from '../bloggers-platform/infrastructure/blogs.repository';
import { PostsRepository } from '../bloggers-platform/infrastructure/posts.repository';
import { CommentsRepository } from '../bloggers-platform/infrastructure/comments.repository';
import { LikesRepository } from '../bloggers-platform/infrastructure/likes.repository';

@Controller('testing')
export class TestingController {
  constructor(
    private usersRepository: UsersRepository,
    private authDeviceSessionsRepository: AuthDeviceSessionsRepository,
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
    private commentsRepository: CommentsRepository,
    private likesRepository: LikesRepository,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @TestingAllDataApi()
  async deleteAll() {
    await this.usersRepository.deleteAllUsers();
    await this.authDeviceSessionsRepository.deleteAllAuthDeviceSessions();
    await this.blogsRepository.deleteAllBlogs();
    await this.postsRepository.deleteAllPosts();
    await this.commentsRepository.deleteAllComments();
    await this.likesRepository.deleteAllLikes();
  }
}
