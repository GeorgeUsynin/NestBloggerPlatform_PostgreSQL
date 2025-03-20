import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GetBlogsQueryParams } from './dto/query-params-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BlogViewDto } from './dto/view-dto/blogs.view-dto';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { CreateBlogInputDto } from './dto/input-dto/create/blogs.input-dto';
import { UpdateBlogInputDto } from './dto/input-dto/update/blogs.input-dto';
import { CreatePostInputDtoWithoutBlogId } from './dto/input-dto/create/posts.input-dto';
import { PostViewDto } from './dto/view-dto/posts.view-dto';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { GetPostsQueryParams } from './dto/query-params-dto/get-posts-query-params.input-dto';
import { JwtOptionalAuthGuard } from '../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../user-accounts/guards/decorators/params/ExtractUserIfExistsFromRequest.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import {
  GetAllBlogsApi,
  GetAllPostsByBlogIdApi,
  CreateBlogApi,
  CreatePostByBlogIdApi,
  UpdateBlogApi,
  DeleteBlogApi,
  UpdatePostApi,
  DeletePostApi,
} from './swagger';
import { BasicAuthGuard } from '../../user-accounts/guards/basic/basic-auth.guard';
import {
  CreateBlogCommand,
  DeleteBlogCommand,
  UpdateBlogCommand,
  CreatePostCommand,
  DeletePostByBlogIdAndPostIdCommand,
  UpdatePostByBlogIdAndPostIdCommand,
} from '../application/use-cases';
import { ApiBasicAuth } from '@nestjs/swagger';
import { UpdatePostInputDto } from './dto/input-dto/update/posts.input-dto';

@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class BlogsSAController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  // Ready
  @ApiBasicAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllBlogsApi()
  async getAllBlogs(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAllBlogs(query);
  }

  // Ready
  // @UseGuards(JwtOptionalAuthGuard)
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

  // Ready
  @ApiBasicAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateBlogApi()
  async createBlog(@Body() payload: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.commandBus.execute(
      new CreateBlogCommand(payload),
    );

    return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
  }

  // Ready
  @ApiBasicAuth()
  // @UseGuards(JwtOptionalAuthGuard)
  @Post(':blogId/posts')
  @HttpCode(HttpStatus.CREATED)
  @CreatePostByBlogIdApi()
  async createPostByBlogID(
    @Param('blogId') blogId: string,
    @Body() payload: CreatePostInputDtoWithoutBlogId,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<PostViewDto> {
    const userId = user ? user.id : null;

    const postId: number = await this.commandBus.execute(
      new CreatePostCommand({
        ...payload,
        blogId,
      }),
    );

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId, userId);
  }

  // Ready
  @ApiBasicAuth()
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdateBlogApi()
  async updateBlogById(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBlogInputDto,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateBlogCommand(id, payload));
  }

  // Ready
  @ApiBasicAuth()
  // @UseGuards(JwtOptionalAuthGuard)
  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  // TODO: fix api route
  @UpdatePostApi()
  async updatePostByBlogIDAndPostID(
    @Param('blogId') blogId: string,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() payload: UpdatePostInputDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdatePostByBlogIdAndPostIdCommand(postId, { ...payload, blogId }),
    );
  }

  // Ready
  @ApiBasicAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteBlogApi()
  async deleteBlogById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.commandBus.execute(new DeleteBlogCommand(id));
  }

  // Ready
  @ApiBasicAuth()
  // @UseGuards(JwtOptionalAuthGuard)
  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  // TODO: fix api route
  @DeletePostApi()
  async deletePostByBlogIDAndPostID(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeletePostByBlogIdAndPostIdCommand(blogId, postId),
    );
  }
}
