import { InjectModel } from '@nestjs/mongoose';
import { UpdateLikeDto } from '../../domain/dto/update/likes.update-dto';
import { Like, LikeModelType } from '../../domain/like.entity';
import { LikesRepository } from '../../infrastructure/likes.repository';
import { LikeStatus } from '../../types';
import { Likeable } from '../../domain/shared.entity';

export class UpdateLikeEntityStatusCommand {
  constructor(
    public readonly entityId: string,
    public readonly userId: string,
    public readonly dto: UpdateLikeDto,
  ) {}
}

export abstract class UpdateLikesEntityUseCase<T extends Likeable> {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
    private likesRepository: LikesRepository,
  ) {}

  async execute(command: UpdateLikeEntityStatusCommand) {
    const { dto, entityId, userId } = command;

    const { likeStatus } = dto;

    const entity = await this.getLikeableEntityById(entityId);

    const like = await this.likesRepository.findLikeByParams({
      parentId: entityId,
      userId,
    });

    /**
     * Scenario where like for the entity DOES NOT EXIST!
     */
    if (!like) {
      // Validation for creation the like with `None` status by default
      if (likeStatus === LikeStatus.None) return;

      // Create and save the like
      const newLike = this.LikeModel.createLike({
        parentId: entityId,
        userId,
        status: likeStatus,
      });
      await this.likesRepository.save(newLike);

      // Update and save the entity
      entity.updateLikesInfoCount(likeStatus);
      await this.saveEntity(entity);

      return;
    }

    /**
     * Scenario where like for the entity EXISTS!
     */

    // Avoid update if new status is the same as current one
    if (like.isSameStatus(likeStatus)) return;

    const oldLikeStatus = like.status;

    // Update and save the like
    like.update(dto);
    await this.likesRepository.save(like);

    // Update and save the entity likes info
    entity.updateLikesInfoCount(likeStatus, oldLikeStatus);
    await this.saveEntity(entity);
  }

  abstract getLikeableEntityById(id: string): Promise<T>;

  abstract saveEntity(entity: T): Promise<T>;
}
