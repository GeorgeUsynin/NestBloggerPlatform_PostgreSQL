import { ApiProperty } from '@nestjs/swagger';
import { AuthDeviceSessionDocument } from '../../../domain/authDeviceSession.entity';

export class AuthDeviceSessionViewDto {
  @ApiProperty({ type: String })
  deviceId: string;

  @ApiProperty({ type: String })
  ip: string;

  @ApiProperty({ type: String })
  lastActiveDate: string;

  @ApiProperty({ type: String })
  title: string;

  static mapToView(
    authDeviceSession: AuthDeviceSessionDocument,
  ): AuthDeviceSessionViewDto {
    const dto = new AuthDeviceSessionViewDto();

    dto.deviceId = authDeviceSession.deviceId;
    dto.ip = authDeviceSession.clientIp;
    dto.lastActiveDate = authDeviceSession.issuedAt;
    dto.title = authDeviceSession.deviceName;

    return dto;
  }
}
