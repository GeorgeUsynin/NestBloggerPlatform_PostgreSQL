import {
  Body,
  Controller,
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
import { ApiBearerAuth } from '@nestjs/swagger';
import { PostViewDto } from './dto/view-dto/posts.view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { GetPostsQueryParams } from './dto/query-params-dto/get-posts-query-params.input-dto';
import { GetCommentsQueryParams } from './dto/query-params-dto/get-comments-query-params.input-dto';
import { CommentViewDto } from './dto/view-dto/comments.view-dto';
import { CreateCommentInputDto } from './dto/input-dto/create/comments.input-dto';
import { UpdateLikeInputDto } from './dto/input-dto/update/likes.input-dto';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { ExtractUserFromRequest } from '../../user-accounts/guards/decorators/params/ExtractUserFromRequest.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import { JwtHeaderAuthGuard } from '../../user-accounts/guards/bearer/jwt-header-auth.guard';
import { JwtOptionalAuthGuard } from '../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../user-accounts/guards/decorators/params/ExtractUserIfExistsFromRequest.decorator';
import {
  GetAllPostsApi,
  GetPostApi,
  GetAllCommentsByPostIdApi,
  UpdatePostLikeStatusApi,
  CreateCommentByPostIdApi,
} from './swagger';
import {
  CreateCommentCommand,
  UpdatePostLikeStatusCommand,
} from '../application/use-cases';
import { ParentType } from '../types';

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
    @Param('postId', ParseIntPipe) postId: number,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const userId = user ? user.id : null;

    return this.commentsQueryRepository.getAllCommentsByPostId(
      query,
      postId,
      userId,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Post(':postId/comments')
  @HttpCode(HttpStatus.CREATED)
  @CreateCommentByPostIdApi()
  async createCommentByPostId(
    @Param('postId', ParseIntPipe) postId: number,
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

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdatePostLikeStatusApi()
  async updateLikePostById(
    @Param('id', ParseIntPipe) postId: number,
    @Body() payload: UpdateLikeInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdatePostLikeStatusCommand(
        postId,
        user.id,
        ParentType.post,
        payload,
      ),
    );
  }
}
