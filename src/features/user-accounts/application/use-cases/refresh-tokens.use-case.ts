import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../../constants';
import { AuthDeviceSessionsRepository } from '../../infrastructure/authDeviceSessions.repository';
import { JwtService } from '@nestjs/jwt';

export class RefreshTokensCommand {
  constructor(
    public readonly userId: number,
    public readonly deviceId: string,
  ) {}
}

export class RefreshTokensUseCaseResponse {
  accessToken: string;
  refreshToken: string;
}

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensUseCase
  implements ICommandHandler<RefreshTokensCommand, RefreshTokensUseCaseResponse>
{
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
    private authDeviceSessionsRepository: AuthDeviceSessionsRepository,
  ) {}

  async execute({ userId, deviceId }: RefreshTokensCommand) {
    const payload = { id: userId };

    const accessToken = this.accessTokenContext.sign(payload);
    const refreshToken = this.refreshTokenContext.sign({
      ...payload,
      deviceId,
    });

    const { iat, exp } = this.refreshTokenContext.decode(refreshToken);

    await this.authDeviceSessionsRepository.findAuthDeviceSessionByDeviceIdOrNotFoundFail(
      deviceId,
    );

    await this.authDeviceSessionsRepository.updateAuthDeviceSession(deviceId, {
      issuedAt: new Date(Number(iat) * 1000),
      expirationDateOfRefreshToken: new Date(Number(exp) * 1000),
    });

    return { accessToken, refreshToken };
  }
}
