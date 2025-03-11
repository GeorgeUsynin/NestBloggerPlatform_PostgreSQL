import { Injectable } from '@nestjs/common';
import {
  AuthDeviceSession,
  AuthDeviceSessionModelType,
} from '../../domain/authDeviceSession.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AuthDeviceSessionViewDto } from '../../api/dto/view-dto/authDeviceSession.view-dto';

@Injectable()
export class AuthDeviceSessionQueryRepository {
  constructor(
    @InjectModel(AuthDeviceSession.name)
    private AuthDeviceSessionModel: AuthDeviceSessionModelType,
  ) {}

  async getAllUserAuthDeviceSessions(
    userId: string,
  ): Promise<AuthDeviceSessionViewDto[]> {
    const authDeviceSessions = await this.AuthDeviceSessionModel.find({
      userId,
    });

    return authDeviceSessions.map(AuthDeviceSessionViewDto.mapToView);
  }
}
