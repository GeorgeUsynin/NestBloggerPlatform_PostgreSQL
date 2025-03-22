import { UpdateLikeDto } from '../../../domain/dto/update/likes.update-dto';
import { LikesRepository } from '../../../infrastructure/likes.repository';
import { LikeStatus } from '../../../types';

export class UpdateLikeStatusCommand {
  constructor(
    public readonly entityId: number,
    public readonly userId: number,
    public readonly dto: UpdateLikeDto,
  ) {}
}

export abstract class UpdateLikesUseCase<T> {
  constructor(private likesRepository: LikesRepository) {}

  async execute(command: UpdateLikeStatusCommand) {
    const { dto, entityId, userId } = command;

    await this.checkThatLikableEntityExists(entityId);

    const { likeStatus } = dto;

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
      await this.likesRepository.createLike({
        parentId: entityId,
        userId,
        status: likeStatus,
      });

      return;
    }

    /**
     * Scenario where like for the entity EXISTS!
     */

    // Avoid update if new status is the same as current one
    if (like.status === likeStatus) return;

    // Update the like
    this.likesRepository.update(like.id, dto);
  }

  abstract checkThatLikableEntityExists(id: number): Promise<T>;
}
