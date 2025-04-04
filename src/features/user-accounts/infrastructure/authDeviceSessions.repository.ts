import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { CreateAuthDeviceSessionDto } from '../domain/dto/create/authDeviceSessions.create-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { AuthDeviceSession } from '../domain/authDeviceSession.entity';

@Injectable()
export class AuthDeviceSessionsRepository {
  // Injection of the model through DI
  constructor(
    @InjectRepository(AuthDeviceSession)
    private authDeviceSessionsRepository: Repository<AuthDeviceSession>,
  ) {}

  create(dto: CreateAuthDeviceSessionDto) {
    return this.authDeviceSessionsRepository.create(dto);
  }

  async findAuthDeviceSessionByDeviceId(deviceId: string) {
    return this.authDeviceSessionsRepository.findOneBy({ deviceId });
  }

  async findAuthDeviceSessionByDeviceIdOrNotFoundFail(deviceId: string) {
    const authDeviceSession = await this.authDeviceSessionsRepository.findOneBy(
      { deviceId },
    );

    if (!authDeviceSession) {
      throw NotFoundDomainException.create('AuthDeviceSession not found');
    }

    return authDeviceSession;
  }

  async deleteDeviceSessionById(deviceId: string) {
    return this.authDeviceSessionsRepository.delete({ deviceId });
  }

  async deleteAllOtherUserDeviceSessions(userId: number, deviceId: string) {
    return this.authDeviceSessionsRepository.delete({
      userId,
      deviceId: Not(deviceId),
    });
  }

  async deleteAllAuthDeviceSessions() {
    return this.authDeviceSessionsRepository.delete({});
  }

  async save(authDeviceSession: AuthDeviceSession) {
    return this.authDeviceSessionsRepository.save(authDeviceSession);
  }
}
