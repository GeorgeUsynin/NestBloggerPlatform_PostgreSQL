import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import {
  AuthDeviceSession,
  AuthDeviceSessionDocument,
  AuthDeviceSessionModelType,
} from '../domain/authDeviceSession.entity';

@Injectable()
export class AuthDeviceSessionsRepository {
  // Injection of the model through DI
  constructor(
    @InjectModel(AuthDeviceSession.name)
    private AuthDeviceSessionModel: AuthDeviceSessionModelType,
  ) {}

  async findAuthDeviceSessionByDeviceIdOrNotFoundFail(
    deviceId: string,
  ): Promise<AuthDeviceSessionDocument> {
    const authDeviceSession = await this.AuthDeviceSessionModel.findOne({
      deviceId,
    });

    if (!authDeviceSession) {
      throw NotFoundDomainException.create('AuthDeviceSession not found');
    }

    return authDeviceSession;
  }

  async findAuthDeviceSession(
    deviceId: string,
  ): Promise<AuthDeviceSessionDocument | null> {
    return await this.AuthDeviceSessionModel.findOne({
      deviceId,
    });
  }

  async deleteAllOtherUserDeviceSessions(userId: string, deviceId: string) {
    return this.AuthDeviceSessionModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }

  async deleteDeviceSessionById(deviceId: string) {
    return this.AuthDeviceSessionModel.findOneAndDelete({ deviceId });
  }

  async save(authDeviceSession: AuthDeviceSessionDocument) {
    return authDeviceSession.save();
  }
}
