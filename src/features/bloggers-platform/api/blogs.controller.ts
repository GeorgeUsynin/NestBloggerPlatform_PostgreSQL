import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
  GetBlogApi,
  GetAllPostsByBlogIdApi,
  CreateBlogApi,
  CreatePostByBlogIdApi,
  UpdateBlogApi,
  DeleteBlogApi,
} from './swagger';
import { ObjectIdValidationPipe } from '../../../core/pipes/objectId-validation-pipe';
import { BasicAuthGuard } from '../../user-accounts/guards/basic/basic-auth.guard';
import {
  CreateBlogCommand,
  DeleteBlogCommand,
  UpdateBlogCommand,
  CreatePostCommand,
} from '../application/use-cases';
import { ApiBasicAuth } from '@nestjs/swagger';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllBlogsApi()
  async getAllBlogs(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAllBlogs(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetBlogApi()
  async getBlogById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<BlogViewDto> {
    return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':blogId/posts')
  @HttpCode(HttpStatus.OK)
  @GetAllPostsByBlogIdApi()
  async getAllPostsByBlogId(
    @Query() query: GetPostsQueryParams,
    @Param('blogId', ObjectIdValidationPipe) blogId: string,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const userId = user ? user.id : null;

    return this.postsQueryRepository.getAllPostsByBlogId(query, userId, blogId);
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateBlogApi()
  async createBlog(@Body() payload: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.commandBus.execute(
      new CreateBlogCommand(payload),
    );

    return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
  }

  @ApiBasicAuth()
  @UseGuards(JwtOptionalAuthGuard, BasicAuthGuard)
  @Post(':blogId/posts')
  @HttpCode(HttpStatus.CREATED)
  @CreatePostByBlogIdApi()
  async createPostByBlogID(
    @Param('blogId', ObjectIdValidationPipe) blogId: string,
    @Body() payload: CreatePostInputDtoWithoutBlogId,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<PostViewDto> {
    const userId = user ? user.id : null;

    const postId = await this.commandBus.execute(
      new CreatePostCommand({
        ...payload,
        blogId,
      }),
    );

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId, userId);
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdateBlogApi()
  async updateBlogById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() payload: UpdateBlogInputDto,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateBlogCommand(id, payload));
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteBlogApi()
  async deleteBlogById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteBlogCommand(id));
  }
}
