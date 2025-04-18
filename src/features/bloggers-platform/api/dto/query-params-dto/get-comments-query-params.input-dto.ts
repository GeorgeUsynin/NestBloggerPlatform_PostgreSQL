import { ApiProperty } from '@nestjs/swagger';
import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional } from 'class-validator';

export enum CommentsSortBy {
  CreatedAt = 'createdAt',
}

// DTO for a query for a list of comments with pagination, sorting, and filtering
export class GetCommentsQueryParams extends BaseSortablePaginationParams<CommentsSortBy> {
  @ApiProperty({ enum: CommentsSortBy })
  @IsOptional()
  @IsEnum(CommentsSortBy)
  sortBy = CommentsSortBy.CreatedAt;
}
