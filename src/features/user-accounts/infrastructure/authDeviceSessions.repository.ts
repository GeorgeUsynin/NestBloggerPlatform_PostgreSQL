import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { CreateAuthDeviceSessionDto } from '../domain/dto/create/authDeviceSessions.create-dto';
import { DBAuthDeviceSession } from './types';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UpdateAuthDeviceSessionDto } from '../domain/dto/update/authDeviceSessions.update-dto';

@Injectable()
export class AuthDeviceSessionsRepository {
  // Injection of the model through DI
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findAuthDeviceSession(
    deviceId: string,
  ): Promise<DBAuthDeviceSession | null> {
    return (
      (
        await this.dataSource.query(
          `
      SELECT * FROM "AuthDeviceSessions"
      WHERE "deviceId" = $1;
      `,
          [deviceId],
        )
      )[0] ?? null
    );
  }

  async findAuthDeviceSessionByDeviceIdOrNotFoundFail(
    deviceId: string,
  ): Promise<DBAuthDeviceSession> {
    const authDeviceSession: DBAuthDeviceSession =
      (
        await this.dataSource.query(
          `
      SELECT * FROM "AuthDeviceSessions"
      WHERE "deviceId" = $1;
      `,
          [deviceId],
        )
      )[0] ?? null;

    if (!authDeviceSession) {
      throw NotFoundDomainException.create('AuthDeviceSession not found');
    }

    return authDeviceSession;
  }

  async createAuthDeviceSession(
    dto: CreateAuthDeviceSessionDto,
  ): Promise<DBAuthDeviceSession> {
    const {
      clientIp,
      deviceId,
      deviceName,
      expirationDateOfRefreshToken,
      issuedAt,
      userId,
    } = dto;

    return this.dataSource.query(
      `
      INSERT INTO "AuthDeviceSessions"
      ("deviceId", "userId", "issuedAt", "deviceName", "clientIp", "expirationDateOfRefreshToken")
	    VALUES ($1, $2, $3, $4, $5, $6);
      `,
      [
        deviceId,
        userId,
        issuedAt,
        deviceName,
        clientIp,
        expirationDateOfRefreshToken,
      ],
    );
  }

  async updateAuthDeviceSession(
    deviceId: string,
    dto: UpdateAuthDeviceSessionDto,
  ) {
    const { expirationDateOfRefreshToken, issuedAt } = dto;

    return this.dataSource.query(
      `
      UPDATE "AuthDeviceSessions"
      SET "expirationDateOfRefreshToken" = $1, "issuedAt" = $2
      WHERE "deviceId" = $3;
      `,
      [expirationDateOfRefreshToken, issuedAt, deviceId],
    );
  }

  async deleteDeviceSessionById(deviceId: string) {
    return this.dataSource.query(
      `
      DELETE FROM "AuthDeviceSessions"
      WHERE "deviceId" = $1;
      `,
      [deviceId],
    );
  }

  async deleteAllOtherUserDeviceSessions(userId: number, deviceId: string) {
    return this.dataSource.query(
      `
      DELETE FROM "AuthDeviceSessions"
      WHERE "userId" = $1 AND "deviceId" != $2
      `,
      [userId, deviceId],
    );
  }
}
