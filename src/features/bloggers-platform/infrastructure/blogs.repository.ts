import { Injectable } from '@nestjs/common';
import {
  Blog,
  BlogDocument,
  BlogModelType,
  DeletionStatus,
} from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}

  async findBlogByIdOrNotFoundFail(id: string) {
    const blog = await this.BlogModel.findOne({
      _id: id,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    });

    if (!blog) {
      throw NotFoundDomainException.create('Blog not found');
    }
    return blog;
  }

  async findBlogById(id: string) {
    const blog = await this.BlogModel.findOne({
      _id: id,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    });

    return blog;
  }

  async save(blog: BlogDocument) {
    return blog.save();
  }
}
