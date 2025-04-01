import { UserViewDto } from '../../api/dto/view-dto/user.view-dto';
import { Injectable } from '@nestjs/common';
import { GetUsersQueryParams } from '../../api/dto/query-params-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/user.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getByIdOrNotFoundFail(id: number): Promise<UserViewDto> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw NotFoundDomainException.create('User not found');
    }

    return UserViewDto.mapToView(user);
  }

  async getAllUsers(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const {
      sortBy,
      sortDirection,
      pageSize,
      searchLoginTerm,
      searchEmailTerm,
    } = query;

    const builder = this.usersRepository
      .createQueryBuilder('user')
      .orderBy(`user.${sortBy}`, sortDirection)
      .offset(query.calculateSkip())
      .limit(pageSize);

    // Apply filters only if searchLoginTerm or searchEmailTerm exist
    const whereConditions: string[] = [];
    const parameters: Record<string, string> = {};

    if (searchLoginTerm) {
      whereConditions.push('user.login ILIKE :login');
      parameters.login = `%${searchLoginTerm}%`;
    }

    if (searchEmailTerm) {
      whereConditions.push('user.email ILIKE :email');
      parameters.email = `%${query.searchEmailTerm}%`;
    }

    if (whereConditions.length > 0) {
      builder.where(whereConditions.join(' OR '), parameters);
    }

    const [users, totalCount] = await builder.getManyAndCount();

    return PaginatedViewDto.mapToView({
      items: users.map((user: User) => UserViewDto.mapToView(user)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }
}
