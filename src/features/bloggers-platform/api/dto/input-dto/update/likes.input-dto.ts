import { UpdateLikeDto } from '../../../../domain/dto/update/likes.update-dto';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation';
import { LikeStatus } from '../../../../domain/like.entity';
import { IsEnum } from 'class-validator';

export class UpdateLikeInputDto implements UpdateLikeDto {
  @IsEnum(LikeStatus)
  @IsStringWithTrim()
  likeStatus: LikeStatus;
}
