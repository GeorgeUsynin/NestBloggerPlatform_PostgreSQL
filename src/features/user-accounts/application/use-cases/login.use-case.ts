import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from '../../constants';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';

export class LoginCommand {
  constructor(public readonly userId: number) {}
}

export class LoginUseCaseResponse {
  accessToken: string;
}

@CommandHandler(LoginCommand)
export class LoginUseCase
  implements ICommandHandler<LoginCommand, LoginUseCaseResponse>
{
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
  ) {}

  async execute({ userId }: LoginCommand) {
    const payload = { id: userId };

    // Creating access token
    const accessToken = this.accessTokenContext.sign(payload);

    return { accessToken };
  }
}
