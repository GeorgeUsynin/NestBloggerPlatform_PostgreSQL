import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../constants';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuthDeviceSessionsRepository } from '../../infrastructure/authDeviceSessions.repository';
import { getDeviceName } from '../../../../helpers';

export class LoginCommand {
  constructor(
    public readonly userId: number,
    public readonly clientIp: string,
    public readonly userAgent?: string,
  ) {}
}

export class LoginUseCaseResponse {
  accessToken: string;
  refreshToken: string;
}

@CommandHandler(LoginCommand)
export class LoginUseCase
  implements ICommandHandler<LoginCommand, LoginUseCaseResponse>
{
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
    private authDeviceSessionsRepository: AuthDeviceSessionsRepository,
  ) {}

  async execute({ userId, clientIp, userAgent }: LoginCommand) {
    const payload = { id: userId };

    const deviceId = randomUUID();

    // Creating access and refresh tokens
    const accessToken = this.accessTokenContext.sign(payload);
    const refreshToken = this.refreshTokenContext.sign({
      ...payload,
      deviceId,
    });

    const { iat, exp } = this.refreshTokenContext.decode(refreshToken);

    await this.authDeviceSessionsRepository.createAuthDeviceSession({
      userId,
      deviceId,
      issuedAt: new Date(Number(iat) * 1000),
      deviceName: getDeviceName(userAgent),
      clientIp,
      expirationDateOfRefreshToken: new Date(Number(exp) * 1000),
    });

    return { accessToken, refreshToken };
  }
}
