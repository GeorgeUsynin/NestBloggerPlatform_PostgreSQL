import { Injectable } from '@nestjs/common';
import { MeViewDto } from '../../api/dto/view-dto/user.view-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../domain/user.entity';
import { Repository } from 'typeorm';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class AuthQueryRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async me(id: number): Promise<MeViewDto> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw NotFoundDomainException.create('User not found');
    }

    return MeViewDto.mapToView(user);
  }
}
