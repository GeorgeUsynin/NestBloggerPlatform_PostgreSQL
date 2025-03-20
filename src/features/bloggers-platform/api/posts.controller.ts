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
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { PostViewDto } from './dto/view-dto/posts.view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { CreatePostInputDto } from './dto/input-dto/create/posts.input-dto';
import { GetPostsQueryParams } from './dto/query-params-dto/get-posts-query-params.input-dto';
import { GetCommentsQueryParams } from './dto/query-params-dto/get-comments-query-params.input-dto';
import { UpdatePostInputDto } from './dto/input-dto/update/posts.input-dto';
import { CommentViewDto } from './dto/view-dto/comments.view-dto';
import { CreateCommentInputDto } from './dto/input-dto/create/comments.input-dto';
import { UpdateLikeInputDto } from './dto/input-dto/update/likes.input-dto';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { ObjectIdValidationPipe } from '../../../core/pipes/objectId-validation-pipe';
import { ExtractUserFromRequest } from '../../user-accounts/guards/decorators/params/ExtractUserFromRequest.decorator';
import { BasicAuthGuard } from '../../user-accounts/guards/basic/basic-auth.guard';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import { JwtHeaderAuthGuard } from '../../user-accounts/guards/bearer/jwt-header-auth.guard';
import { JwtOptionalAuthGuard } from '../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../user-accounts/guards/decorators/params/ExtractUserIfExistsFromRequest.decorator';
import {
  CreatePostApi,
  GetAllPostsApi,
  GetPostApi,
  UpdatePostApi,
  DeletePostApi,
  GetAllCommentsByPostIdApi,
  UpdatePostLikeStatusApi,
  CreateCommentByPostIdApi,
} from './swagger';
import {
  CreatePostCommand,
  UpdatePostCommand,
  DeletePostCommand,
  CreateCommentCommand,
  UpdateLikePostStatusCommand,
} from '../application/use-cases';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllPostsApi()
  async getAllPosts(
    @Query() query: GetPostsQueryParams,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const userId = user ? user.id : null;

    return this.postsQueryRepository.getAllPosts(query, userId);
  }

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetPostApi()
  async getPostById(
    @Param('id', ParseIntPipe) id: number,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<PostViewDto> {
    const userId = user ? user.id : null;

    return this.postsQueryRepository.getByIdOrNotFoundFail(id, userId);
  }

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':postId/comments')
  @HttpCode(HttpStatus.OK)
  @GetAllCommentsByPostIdApi()
  async getAllCommentsByPostId(
    @Query() query: GetCommentsQueryParams,
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const userId = user ? user.id : null;

    return this.commentsQueryRepository.getAllCommentsByPostId(
      query,
      postId,
      userId,
    );
  }

  @ApiBasicAuth()
  @UseGuards(JwtOptionalAuthGuard, BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreatePostApi()
  async createPost(
    @Body() payload: CreatePostInputDto,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<PostViewDto> {
    const userId = user ? user.id : null;

    const postId = await this.commandBus.execute(
      new CreatePostCommand(payload),
    );

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Post(':postId/comments')
  @HttpCode(HttpStatus.CREATED)
  @CreateCommentByPostIdApi()
  async createCommentByPostId(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Body() payload: CreateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<CommentViewDto> {
    const commentId = await this.commandBus.execute(
      new CreateCommentCommand({
        content: payload.content,
        postId,
        userId: user.id,
      }),
    );

    return this.commentsQueryRepository.getByIdOrNotFoundFail(
      commentId,
      user.id,
    );
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdatePostApi()
  async updatePostById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() payload: UpdatePostInputDto,
  ): Promise<void> {
    return this.commandBus.execute(new UpdatePostCommand(id, payload));
  }

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdatePostLikeStatusApi()
  async updateLikePostById(
    @Param('id', ObjectIdValidationPipe) postId: string,
    @Body() payload: UpdateLikeInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateLikePostStatusCommand(postId, user.id, payload),
    );
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeletePostApi()
  async deletePostById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeletePostCommand(id));
  }
}
