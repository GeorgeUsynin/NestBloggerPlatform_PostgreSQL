import { ApiProperty, OmitType } from '@nestjs/swagger';
import { User } from '../../../domain/user.entity';

export class UserViewDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  login: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  static mapToView(user: User): UserViewDto {
    const dto: UserViewDto = {
      id: user.id.toString(),
      email: user.email,
      login: user.login,
      createdAt: user.createdAt,
    };

    return dto;
  }
}

export class MeViewDto extends OmitType(UserViewDto, [
  'createdAt',
  'id',
] as const) {
  userId: string;

  static mapToView(user: User): MeViewDto {
    const dto = new MeViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.userId = user.id.toString();

    return dto;
  }
}
