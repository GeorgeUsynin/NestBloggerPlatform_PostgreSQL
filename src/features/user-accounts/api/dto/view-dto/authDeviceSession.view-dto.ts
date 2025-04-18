import { ApiProperty } from '@nestjs/swagger';
import { AuthDeviceSession } from '../../../domain/authDeviceSession.entity';

export class AuthDeviceSessionViewDto {
  @ApiProperty({ type: String })
  deviceId: string;

  @ApiProperty({ type: String })
  ip: string;

  @ApiProperty({ type: Date })
  lastActiveDate: Date;

  @ApiProperty({ type: String })
  title: string;

  static mapToView(
    authDeviceSession: AuthDeviceSession,
  ): AuthDeviceSessionViewDto {
    const dto = new AuthDeviceSessionViewDto();

    dto.deviceId = authDeviceSession.deviceId;
    dto.ip = authDeviceSession.clientIp;
    dto.lastActiveDate = authDeviceSession.issuedAt;
    dto.title = authDeviceSession.deviceName;

    return dto;
  }
}
