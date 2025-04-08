import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetBlogsQueryParams } from './dto/query-params-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BlogViewDto } from './dto/view-dto/blogs.view-dto';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { PostViewDto } from './dto/view-dto/posts.view-dto';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { GetPostsQueryParams } from './dto/query-params-dto/get-posts-query-params.input-dto';
import { JwtOptionalAuthGuard } from '../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../user-accounts/guards/decorators/params/ExtractUserIfExistsFromRequest.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import { GetAllBlogsApi, GetBlogApi, GetAllPostsByBlogIdApi } from './swagger';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  // DONE
  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllBlogsApi()
  async getAllBlogs(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAllBlogs(query);
  }

  // DONE
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetBlogApi()
  async getBlogById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BlogViewDto> {
    return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
  }

  // DONE
  @UseGuards(JwtOptionalAuthGuard)
  @Get(':blogId/posts')
  @HttpCode(HttpStatus.OK)
  @GetAllPostsByBlogIdApi()
  async getAllPostsByBlogId(
    @Query() query: GetPostsQueryParams,
    @Param('blogId', ParseIntPipe) blogId: number,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const userId = user ? user.id : null;

    return this.postsQueryRepository.getAllPostsByBlogId(query, userId, blogId);
  }
}
