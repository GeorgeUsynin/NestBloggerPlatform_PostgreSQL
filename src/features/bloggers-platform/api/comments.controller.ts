import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { CommentViewDto } from './dto/view-dto/comments.view-dto';
import {
  DeleteCommentApi,
  GetCommentApi,
  UpdateCommentApi,
  UpdateCommentLikeStatusApi,
} from './swagger';
import { JwtHeaderAuthGuard } from '../../user-accounts/guards/bearer/jwt-header-auth.guard';
import { JwtOptionalAuthGuard } from '../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserFromRequest } from '../../user-accounts/guards/decorators/params/ExtractUserFromRequest.decorator';
import { ExtractUserIfExistsFromRequest } from '../../user-accounts/guards/decorators/params/ExtractUserIfExistsFromRequest.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import { UpdateCommentInputDto } from './dto/input-dto/update/comments.input-dto';
import { UpdateLikeInputDto } from './dto/input-dto/update/likes.input-dto';
import {
  DeleteCommentCommand,
  UpdateCommentCommand,
  UpdateCommentLikeStatusCommand,
} from '../application/use-cases';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetCommentApi()
  async getCommentById(
    @Param('id', ParseIntPipe) id: number,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<CommentViewDto> {
    const userId = user ? user.id : null;

    return this.commentsQueryRepository.getByIdOrNotFoundFail(id, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdateCommentApi()
  async updateCommentById(
    @Param('id', ParseIntPipe) commentId: number,
    @Body() payload: UpdateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateCommentCommand(commentId, user.id, payload),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Put(':id/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdateCommentLikeStatusApi()
  async updateLikeCommentById(
    @Param('id', ParseIntPipe) commentId: number,
    @Body() payload: UpdateLikeInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateCommentLikeStatusCommand(commentId, user.id, payload),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteCommentApi()
  async deleteCommentById(
    @Param('id', ParseIntPipe) commentId: number,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteCommentCommand(commentId, user.id),
    );
  }
}
