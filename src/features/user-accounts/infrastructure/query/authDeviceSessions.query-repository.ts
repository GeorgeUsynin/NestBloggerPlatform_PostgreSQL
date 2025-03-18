import { Injectable } from '@nestjs/common';
import { AuthDeviceSessionViewDto } from '../../api/dto/view-dto/authDeviceSession.view-dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DBAuthDeviceSession } from '../types';

@Injectable()
export class AuthDeviceSessionQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllUserAuthDeviceSessions(
    userId: number,
  ): Promise<AuthDeviceSessionViewDto[]> {
    const authDeviceSessions: DBAuthDeviceSession[] =
      await this.dataSource.query(
        `
        SELECT * FROM "AuthDeviceSessions"
        WHERE "userId" = $1;
        `,
        [userId],
      );

    return authDeviceSessions.map(AuthDeviceSessionViewDto.mapToView);
  }
}
