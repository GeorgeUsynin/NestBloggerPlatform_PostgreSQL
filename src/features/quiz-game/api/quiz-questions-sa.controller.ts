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
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import {
  CreateQuizQuestionApi,
  UpdateQuizQuestionApi,
  UpdatePublishQuizQuestionApi,
  DeleteQuizQuestionApi,
} from './swagger';
import { BasicAuthGuard } from '../../user-accounts/guards/basic/basic-auth.guard';
import {
  UpdatePublishQuizQuestionCommand,
  CreateQuizQuestionCommand,
  UpdateQuizQuestionCommand,
  DeleteQuizQuestionCommand,
} from '../application/use-cases';
import { ApiBasicAuth } from '@nestjs/swagger';
import { CreateQuizQuestionInputDto } from './dto/input-dto/create/quiz-question.input-dto';
import { QuizQuestionViewDto } from './dto/view-dto/quiz-questions.view-dto';
import { QuizQuestionsQueryRepository } from '../infrastructure/quiz-questions.query-repository';
import { GetQuizQuestionsQueryParams } from './dto/query-params-dto/get-quiz-questions-query-params.input-dto';
import { GetAllQuizQuestionsApi } from './swagger';
import { UpdateQuizQuestionInputDto } from './dto/input-dto/update/quiz-question.input-dto';
import { UpdatePublishQuizQuestionsInputDto } from './dto/input-dto/update/publish-quiz-questions.input-dto';

@ApiBasicAuth()
@UseGuards(BasicAuthGuard)
@Controller('sa/quiz/questions')
export class QuizQuestionsSAController {
  constructor(
    private quizQuestionsQueryRepository: QuizQuestionsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllQuizQuestionsApi()
  async getAllQuizQuestions(
    @Query() query: GetQuizQuestionsQueryParams,
  ): Promise<PaginatedViewDto<QuizQuestionViewDto[]>> {
    return this.quizQuestionsQueryRepository.getAllQuizQuestions(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateQuizQuestionApi()
  async createQuizQuestion(
    @Body() payload: CreateQuizQuestionInputDto,
  ): Promise<QuizQuestionViewDto> {
    const quizQuestionId = await this.commandBus.execute(
      new CreateQuizQuestionCommand(payload),
    );

    return this.quizQuestionsQueryRepository.getByIdOrNotFoundFail(
      quizQuestionId,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdateQuizQuestionApi()
  async updateQuizQuestionById(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateQuizQuestionInputDto,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateQuizQuestionCommand(id, payload));
  }

  @Put(':id/publish')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdatePublishQuizQuestionApi()
  async updatePublishQuizQuestionById(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePublishQuizQuestionsInputDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdatePublishQuizQuestionCommand(id, payload),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteQuizQuestionApi()
  async deleteBlogById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.commandBus.execute(new DeleteQuizQuestionCommand(id));
  }
}
