// Base class for query parameters with pagination
// Default values will be applied automatically when setting up the global ValidationPipe in main.ts

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsEnum } from 'class-validator';

export class PaginationParams {
  // For transformation to number
  @ApiProperty({
    required: false,
    description: 'pageNumber is number of portions that should be returned',
  })
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  pageNumber: number = 1;

  @ApiProperty({
    required: false,
    description: 'pageSize is portions size that should be returned',
  })
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  pageSize: number = 10;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

// Base class for query parameters with sorting and pagination
// The sortBy field must be implemented in the subclasses
export abstract class BaseSortablePaginationParams<T> extends PaginationParams {
  @ApiProperty({ enum: SortDirection, required: false })
  @IsEnum(SortDirection)
  sortDirection: SortDirection = SortDirection.Desc;

  @ApiProperty({ required: false })
  abstract sortBy: T;
}
