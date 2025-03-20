import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../bloggers-platform/domain/blog.entity';
import { Post, PostModelType } from '../bloggers-platform/domain/post.entity';
import { Like, LikeModelType } from '../bloggers-platform/domain/like.entity';

import {
  Comment,
  CommentModelType,
} from '../bloggers-platform/domain/comment.entity';
import { TestingAllDataApi } from './swagger/testing-all-data.decorator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @TestingAllDataApi()
  async deleteAll() {
    await this.dataSource.query(`DELETE FROM "Users"`);
    await this.dataSource.query(`DELETE FROM "AuthDeviceSessions"`);
    await this.dataSource.query(`DELETE FROM "Blogs"`);
    await this.dataSource.query(`DELETE FROM "Posts"`);
    await this.CommentModel.deleteMany();
    await this.LikeModel.deleteMany();
  }
}
