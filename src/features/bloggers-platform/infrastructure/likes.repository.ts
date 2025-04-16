import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLikeDto } from '../domain/dto/create/likes.create-dto';
import { Like } from '../domain/like.entity';

type TParams = {
  parentId: number;
  userId: number;
};

@Injectable()
export class LikesRepository {
  constructor(
    @InjectRepository(Like) private likesRepository: Repository<Like>,
  ) {}

  create(dto: CreateLikeDto) {
    return this.likesRepository.create(dto);
  }

  async findLikeByParams(params: TParams): Promise<Like | null> {
    const { parentId, userId } = params;

    return this.likesRepository.findOneBy({ parentId, userId });
  }

  async deleteAllLikes() {
    return this.likesRepository.delete({});
  }

  async save(like: Like) {
    return this.likesRepository.save(like);
  }
}
