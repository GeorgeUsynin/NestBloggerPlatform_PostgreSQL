import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserAccountsConfig } from '../../config';
import { AuthDeviceSessionsRepository } from '../../infrastructure/authDeviceSessions.repository';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';
import {
  JwtCookiePayloadDto,
  RefreshTokenContextDto,
} from '../dto/refresh-token-context.dto';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor(
    protected userAccountConfig: UserAccountsConfig,
    private authDeviceSessionsRepository: AuthDeviceSessionsRepository,
    private usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtCookieStrategy.cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: userAccountConfig.JWT_SECRET,
    });
  }

  private static cookieExtractor(req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['refreshToken'];
    }
    return token;
  }

  async validate(
    payload: JwtCookiePayloadDto,
  ): Promise<RefreshTokenContextDto> {
    const { id: userId, deviceId, iat } = payload;

    // Checking if user exists
    const isUserExists = Boolean(
      await this.usersRepository.findUserById(userId),
    );

    if (!isUserExists) {
      throw UnauthorizedDomainException.create();
    }

    // Checking if authDeviceSession exists
    const authDeviceSession =
      await this.authDeviceSessionsRepository.findAuthDeviceSession(deviceId);

    if (!authDeviceSession) {
      throw UnauthorizedDomainException.create();
    }

    // Checking if refreshTokenVersion is valid
    const isRefreshTokenVersionValid =
      new Date(Number(iat) * 1000).toISOString() === authDeviceSession.issuedAt;

    if (!isRefreshTokenVersionValid) {
      throw UnauthorizedDomainException.create();
    }

    return { id: payload.id, deviceId };
  }
}
