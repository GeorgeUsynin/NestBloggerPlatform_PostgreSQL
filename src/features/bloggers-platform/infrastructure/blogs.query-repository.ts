import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BlogViewDto } from '../api/dto/view-dto/blogs.view-dto';
import { GetBlogsQueryParams } from '../api/dto/query-params-dto/get-blogs-query-params.input-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DBBlog } from './types';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getByIdOrNotFoundFail(id: number): Promise<BlogViewDto> {
    const blog =
      (
        await this.dataSource.query(
          `
      SELECT * FROM "Blogs"
      WHERE id = $1 AND "deletedAt" IS NULL
      `,
          [id],
        )
      )[0] ?? null;

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return BlogViewDto.mapToView(blog);
  }

  async getAllBlogs(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    // TODO: Refactor with dynamic query and filter!

    const [items, totalCount] = await Promise.all([
      this.findBlogItemsByQueryParams(query),
      this.getTotalBlogsCount(query),
    ]);

    return PaginatedViewDto.mapToView({
      items: items.map((item) => BlogViewDto.mapToView(item)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async findBlogItemsByQueryParams(
    query: GetBlogsQueryParams,
  ): Promise<DBBlog[]> {
    const { sortBy, sortDirection, pageSize, searchNameTerm } = query;

    return this.dataSource.query(
      `
      SELECT * FROM "Blogs" as b
      WHERE b."deletedAt" IS NULL
      AND b.name ILIKE $1
      ORDER BY b."${sortBy}" ${sortDirection}
      LIMIT $2 OFFSET $3
      `,
      [`%${searchNameTerm ?? ''}%`, pageSize, query.calculateSkip()],
    );
  }

  async getTotalBlogsCount(query: GetBlogsQueryParams): Promise<number> {
    const { searchNameTerm } = query;

    const { count } = (
      await this.dataSource.query(
        `
      SELECT COUNT(*)::int FROM "Blogs" as b
      WHERE b."deletedAt" IS NULL
      AND b.name ILIKE $1
      `,
        [`%${searchNameTerm ?? ''}%`],
      )
    )[0];

    return count;
  }
}
