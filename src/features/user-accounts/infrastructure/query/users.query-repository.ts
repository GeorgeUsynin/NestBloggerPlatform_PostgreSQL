import { DeletionStatus, User, UserModelType } from '../../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserViewDto } from '../../api/dto/view-dto/user.view-dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetUsersQueryParams } from '../../api/dto/query-params-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserViewDto.mapToView(user);
  }

  async getAllUsers(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const filter: FilterQuery<User> = {
      deletionStatus: DeletionStatus.NotDeleted,
    };

    if (query.searchLoginTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        login: { $regex: query.searchLoginTerm, $options: 'i' },
      });
    }

    if (query.searchEmailTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        email: { $regex: query.searchEmailTerm, $options: 'i' },
      });
    }

    const items = await this.findUserItemsByParamsAndFilter(query, filter);
    const totalCount = await this.getTotalCountOfFilteredUsers(filter);

    return PaginatedViewDto.mapToView({
      items: items.map((item) => UserViewDto.mapToView(item)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async findUserItemsByParamsAndFilter(
    query: GetUsersQueryParams,
    filter: FilterQuery<User>,
  ) {
    const { sortBy, sortDirection, pageSize } = query;
    return this.UserModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(query.calculateSkip())
      .limit(pageSize);
  }

  async getTotalCountOfFilteredUsers(filter: FilterQuery<User>) {
    return this.UserModel.countDocuments(filter);
  }
}
