import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthDeviceSessionsRepository } from '../../infrastructure/authDeviceSessions.repository';

export class LogoutCommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
  ) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
  constructor(
    private authDeviceSessionsRepository: AuthDeviceSessionsRepository,
  ) {}

  async execute({ userId, deviceId }: LogoutCommand) {
    const authDeviceSession =
      await this.authDeviceSessionsRepository.findAuthDeviceSessionByDeviceIdOrNotFoundFail(
        deviceId,
      );

    if (authDeviceSession.isDeviceOwner(userId)) {
      await this.authDeviceSessionsRepository.deleteDeviceSessionById(deviceId);
    }
  }
}
