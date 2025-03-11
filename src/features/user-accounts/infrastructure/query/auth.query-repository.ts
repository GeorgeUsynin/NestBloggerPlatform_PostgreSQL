import { Injectable } from '@nestjs/common';
import { MeViewDto } from '../../api/dto/view-dto/user.view-dto';
import { UsersRepository } from '../users.repository';

@Injectable()
export class AuthQueryRepository {
  constructor(private usersRepository: UsersRepository) {}

  async me(id: string): Promise<MeViewDto> {
    const user = await this.usersRepository.findUserByIdOrNotFoundFail(id);

    return MeViewDto.mapToView(user);
  }
}
