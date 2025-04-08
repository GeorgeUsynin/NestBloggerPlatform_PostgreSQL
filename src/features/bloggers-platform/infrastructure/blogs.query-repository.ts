import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BlogViewDto } from '../api/dto/view-dto/blogs.view-dto';
import { GetBlogsQueryParams } from '../api/dto/query-params-dto/get-blogs-query-params.input-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../domain/blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
  ) {}

  async getByIdOrNotFoundFail(id: number): Promise<BlogViewDto> {
    const blog = await this.blogsRepository.findOneBy({ id });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return BlogViewDto.mapToView(blog);
  }

  async getAllBlogs(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const { sortBy, sortDirection, pageSize, searchNameTerm } = query;

    const builder = this.blogsRepository
      .createQueryBuilder('blog')
      .orderBy(`blog.${sortBy}`, sortDirection.toUpperCase() as 'ASC' | 'DESC')
      .offset(query.calculateSkip())
      .limit(pageSize);

    if (searchNameTerm) {
      builder.where('blog.name ILIKE :name', {
        name: `%${searchNameTerm}%`,
      });
    }

    const [blogs, totalCount] = await builder.getManyAndCount();

    return PaginatedViewDto.mapToView({
      items: blogs.map((item) => BlogViewDto.mapToView(item)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }
}
