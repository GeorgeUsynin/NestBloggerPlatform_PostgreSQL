import { UserViewDto } from '../../api/dto/view-dto/user.view-dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetUsersQueryParams } from '../../api/dto/query-params-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DBUser } from '../types';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getByIdOrNotFoundFail(id: number): Promise<UserViewDto> {
    const user: DBUser = (
      await this.dataSource.query(
        `
      SELECT * FROM "Users" as u
      WHERE u.id = $1 AND u."deletedAt" IS NULL;
      `,
        [id],
      )
    )[0];

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserViewDto.mapToView(user);
  }

  async getAllUsers(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    // TODO: Refactor with dynamic query and filter!

    const [items, totalCount] = await Promise.all([
      this.findUserItemsByQueryParams(query),
      this.getTotalUsersCount(query),
    ]);

    return PaginatedViewDto.mapToView({
      items: items.map((item: DBUser) => UserViewDto.mapToView(item)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async findUserItemsByQueryParams(
    query: GetUsersQueryParams,
  ): Promise<DBUser[]> {
    const {
      sortBy,
      sortDirection,
      pageSize,
      searchEmailTerm,
      searchLoginTerm,
    } = query;

    return this.dataSource.query(
      `
      SELECT * FROM "Users" as u
      WHERE u."deletedAt" IS NULL
      AND (u.email ILIKE $1 OR u.login ILIKE $2)
      ORDER BY u."${sortBy}" ${sortDirection}
      LIMIT $3 OFFSET $4
      `,
      [
        `%${searchEmailTerm ?? ''}%`,
        `%${searchLoginTerm ?? ''}%`,
        pageSize,
        query.calculateSkip(),
      ],
    );
  }

  async getTotalUsersCount(query: GetUsersQueryParams): Promise<number> {
    const { searchEmailTerm, searchLoginTerm } = query;

    const { count } = (
      await this.dataSource.query(
        `
      SELECT COUNT(*)::int FROM "Users" as u
      WHERE u."deletedAt" IS NULL
      AND (u.email ILIKE $1 OR u.login ILIKE $2)
      `,
        [`%${searchEmailTerm ?? ''}%`, `%${searchLoginTerm ?? ''}%`],
      )
    )[0];

    return count;
  }
}
