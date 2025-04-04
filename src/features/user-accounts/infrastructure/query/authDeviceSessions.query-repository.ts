import { Injectable } from '@nestjs/common';
import { AuthDeviceSessionViewDto } from '../../api/dto/view-dto/authDeviceSession.view-dto';
import { AuthDeviceSession } from '../../domain/authDeviceSession.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthDeviceSessionQueryRepository {
  constructor(
    @InjectRepository(AuthDeviceSession)
    private authDeviceSessionsRepository: Repository<AuthDeviceSession>,
  ) {}

  async getAllUserAuthDeviceSessions(
    userId: number,
  ): Promise<AuthDeviceSessionViewDto[]> {
    const authDeviceSessions: AuthDeviceSession[] =
      await this.authDeviceSessionsRepository.findBy({ userId });

    return authDeviceSessions.map(AuthDeviceSessionViewDto.mapToView);
  }
}
