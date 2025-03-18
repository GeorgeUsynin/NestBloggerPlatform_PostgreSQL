import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthDeviceSessionsRepository } from '../../infrastructure/authDeviceSessions.repository';
import { ForbiddenDomainException } from '../../../../core/exceptions/domain-exceptions';

export class LogoutCommand {
  constructor(
    public readonly userId: number,
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

    // Is device owner check
    if (authDeviceSession.userId === userId) {
      await this.authDeviceSessionsRepository.deleteDeviceSessionById(deviceId);
    } else {
      throw ForbiddenDomainException.create(
        'You are not an owner of the device',
      );
    }
  }
}
