import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBasicAuth } from '@nestjs/swagger';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { UserViewDto } from './dto/view-dto/user.view-dto';
import { CreateUserInputDto } from './dto/input-dto/create/users.input-dto';
import { GetUsersQueryParams } from './dto/query-params-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';
import { Public } from '../guards/decorators/public.decorator';
import {
  CreateUserApi,
  DeleteUserApi,
  GetAllUsersApi,
  GetUserApi,
} from './swagger';
import { CreateUserCommand, DeleteUserCommand } from '../application/use-cases';
import { ObjectIdValidationPipe } from '../../../core/pipes/objectId-validation-pipe';

@Controller('users')
@ApiBasicAuth()
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetUserApi()
  async getById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<UserViewDto> {
    return this.usersQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllUsersApi()
  async getAllUsers(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getAllUsers(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateUserApi()
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.commandBus.execute(new CreateUserCommand(body));

    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteUserApi()
  async deleteUser(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
