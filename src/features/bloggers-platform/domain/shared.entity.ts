import { Prop } from '@nestjs/mongoose';
import { LikeStatus } from '../types';

export class Likeable {
  @Prop({
    type: {
      dislikesCount: Number,
      likesCount: Number,
    },
    default: { dislikesCount: 0, likesCount: 0 }, // Set default object
    _id: false,
  })
  likesInfo: {
    dislikesCount: number;
    likesCount: number;
  };

  updateLikesInfoCount(newLikeStatus: LikeStatus, oldLikeStatus?: LikeStatus) {
    if (!oldLikeStatus) {
      if (newLikeStatus === LikeStatus.Like) {
        this.likesInfo.likesCount += 1;
      } else if (newLikeStatus === LikeStatus.Dislike) {
        this.likesInfo.dislikesCount += 1;
      }
    } else {
      switch (oldLikeStatus) {
        case LikeStatus.Like:
          if (newLikeStatus === LikeStatus.Dislike) {
            this.likesInfo.likesCount -= 1;
            this.likesInfo.dislikesCount += 1;
          } else if (newLikeStatus === LikeStatus.None) {
            this.likesInfo.likesCount -= 1;
          }
          break;

        case LikeStatus.Dislike:
          if (newLikeStatus === LikeStatus.Like) {
            this.likesInfo.likesCount += 1;
            this.likesInfo.dislikesCount -= 1;
          } else if (newLikeStatus === LikeStatus.None) {
            this.likesInfo.dislikesCount -= 1;
          }
          break;

        case LikeStatus.None:
          if (newLikeStatus === LikeStatus.Like) {
            this.likesInfo.likesCount += 1;
          } else if (newLikeStatus === LikeStatus.Dislike) {
            this.likesInfo.dislikesCount += 1;
          }
          break;
      }
    }
  }
}
