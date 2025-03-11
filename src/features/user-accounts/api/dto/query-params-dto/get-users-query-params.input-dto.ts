import { ApiProperty } from '@nestjs/swagger';
import { IsStringWithMessage } from '../../../../../core/decorators/validation';
import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional } from 'class-validator';

export enum UsersSortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

// DTO for a query for a list of users with pagination, sorting, and filtering
export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortBy> {
  @ApiProperty({ enum: UsersSortBy })
  @IsEnum(UsersSortBy)
  sortBy = UsersSortBy.CreatedAt;

  @ApiProperty({
    type: String,
    description:
      'Search term for user Login: Login should contains this term in any position',
    required: false,
  })
  @IsStringWithMessage()
  @IsOptional()
  searchLoginTerm: string | null = null;

  @ApiProperty({
    type: String,
    description:
      'Search term for user Email: Email should contains this term in any position',
    required: false,
  })
  @IsStringWithMessage()
  @IsOptional()
  searchEmailTerm: string | null = null;
}
