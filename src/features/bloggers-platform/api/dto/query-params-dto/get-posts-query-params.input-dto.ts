import { ApiProperty } from '@nestjs/swagger';
import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum } from 'class-validator';

export enum PostsSortBy {
  CreatedAt = 'createdAt',
  Title = 'title',
  BlogName = 'blogName',
}

// DTO for a query for a list of posts with pagination, sorting, and filtering
export class GetPostsQueryParams extends BaseSortablePaginationParams<PostsSortBy> {
  @ApiProperty({ enum: PostsSortBy })
  @IsEnum(PostsSortBy)
  sortBy = PostsSortBy.CreatedAt;
}
