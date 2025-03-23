import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DBLike } from './types';
import { CreateLikeDto } from '../domain/dto/create/likes.create-dto';
import { UpdateLikeDto } from '../domain/dto/update/likes.update-dto';

type TParams = {
  parentId: number;
  userId: number;
};

@Injectable()
export class LikesRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createLike(dto: CreateLikeDto) {
    const { parentId, status, userId } = dto;

    return this.dataSource.query(
      `
      INSERT INTO "Likes"
      ("userId", "parentId", status)
      VALUES($1, $2, $3)
      `,
      [userId, parentId, status],
    );
  }

  async findLikeByParams(params: TParams): Promise<DBLike> {
    const { parentId, userId } = params;

    return (
      await this.dataSource.query(
        `
      SELECT * FROM "Likes"
      WHERE "parentId" = $1 AND "userId" = $2;
      `,
        [parentId, userId],
      )
    )[0];
  }

  async update(likeId: number, dto: UpdateLikeDto) {
    const { likeStatus } = dto;

    return this.dataSource.query(
      `
        UPDATE "Likes"
        SET status = $1
        WHERE id = $2
        `,
      [likeStatus, likeId],
    );
  }
}
