import { DeletionStatus, Blog, BlogModelType } from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BlogViewDto } from '../api/dto/view-dto/blogs.view-dto';
import { GetBlogsQueryParams } from '../api/dto/query-params-dto/get-blogs-query-params.input-dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}

  async getByIdOrNotFoundFail(id: string): Promise<BlogViewDto> {
    const blog = await this.BlogModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    }).exec();

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return BlogViewDto.mapToView(blog);
  }

  async getAllBlogs(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const filter: FilterQuery<Blog> = {
      deletionStatus: DeletionStatus.NotDeleted,
    };

    if (query.searchNameTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        name: { $regex: query.searchNameTerm, $options: 'i' },
      });
    }

    const items = await this.findBlogItemsByParamsAndFilter(query, filter);
    const totalCount = await this.getTotalCountOfFilteredBlogs(filter);

    return PaginatedViewDto.mapToView({
      items: items.map((item) => BlogViewDto.mapToView(item)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async findBlogItemsByParamsAndFilter(
    query: GetBlogsQueryParams,
    filter: FilterQuery<Blog>,
  ) {
    const { sortBy, sortDirection, pageSize } = query;

    return this.BlogModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(query.calculateSkip())
      .limit(pageSize);
  }

  async getTotalCountOfFilteredBlogs(filter: FilterQuery<Blog>) {
    return this.BlogModel.countDocuments(filter);
  }
}
