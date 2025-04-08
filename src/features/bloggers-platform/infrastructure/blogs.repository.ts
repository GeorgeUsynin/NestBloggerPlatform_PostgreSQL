import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { CreateBlogDto } from '../domain/dto/create/blogs.create-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
  ) {}

  create(dto: CreateBlogDto) {
    return this.blogsRepository.create(dto);
  }

  async findBlogByIdOrNotFoundFail(id: number) {
    const blog = await this.blogsRepository.findOneBy({ id });

    if (!blog) {
      throw NotFoundDomainException.create('Blog not found');
    }

    return blog;
  }

  async findBlogById(id: number) {
    return await this.blogsRepository.findOneBy({ id });
  }

  async softDeleteBlogById(id: number) {
    return this.blogsRepository.softDelete(id);
  }

  async deleteAllBlogs() {
    return this.blogsRepository.delete({});
  }

  async save(blog: Blog) {
    return this.blogsRepository.save(blog);
  }
}
