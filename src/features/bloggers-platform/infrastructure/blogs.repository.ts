import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { DBBlog } from './types';
import { CreateBlogDto } from '../domain/dto/create/blogs.create-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UpdateBlogDto } from '../domain/dto/update/blogs.update-dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createBlog(dto: CreateBlogDto): Promise<DBBlog['id']> {
    const { description, name, websiteUrl } = dto;

    const query = `
      INSERT INTO "Blogs"
      (name, description, "websiteUrl")
      VALUES ($1, $2, $3)
      RETURNING id;
      `;

    const { id } = (
      await this.dataSource.query(query, [name, description, websiteUrl])
    )[0];

    return id;
  }

  async findBlogById(id: number): Promise<DBBlog> {
    const blog =
      (
        await this.dataSource.query(
          `
    SELECT * FROM "Blogs"
    WHERE id = $1 AND "deletedAt" IS NULL;
    `,
          [id],
        )
      )[0] ?? null;

    return blog;
  }

  async findBlogByIdOrNotFoundFail(id: number): Promise<DBBlog> {
    const blog =
      (
        await this.dataSource.query(
          `
      SELECT * FROM "Blogs"
      WHERE id = $1 AND "deletedAt" IS NULL;
      `,
          [id],
        )
      )[0] ?? null;

    if (!blog) {
      throw NotFoundDomainException.create('Blog not found');
    }

    return blog;
  }

  async update(blogId: number, dto: UpdateBlogDto) {
    const { description, name, websiteUrl } = dto;

    return this.dataSource.query(
      `
      UPDATE "Blogs"
      SET description = $1, name = $2, "websiteUrl" = $3
      WHERE id = $4 AND "deletedAt" IS NULL;
      `,
      [description, name, websiteUrl, blogId],
    );
  }

  async deleteBlogById(blogId: number) {
    return this.dataSource.query(
      `
      UPDATE "Blogs"
	    SET "deletedAt" = $1
	    WHERE id = $2;
      `,
      [new Date(), blogId],
    );
  }
}
