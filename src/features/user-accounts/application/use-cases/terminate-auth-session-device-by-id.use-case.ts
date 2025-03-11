import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthDeviceSessionsRepository } from '../../infrastructure/authDeviceSessions.repository';

export class TerminateAuthSessionDeviceByIdCommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
  ) {}
}

@CommandHandler(TerminateAuthSessionDeviceByIdCommand)
export class TerminateAuthSessionDeviceByIdUseCase
  implements ICommandHandler<TerminateAuthSessionDeviceByIdCommand, void>
{
  constructor(
    private authDeviceSessionsRepository: AuthDeviceSessionsRepository,
  ) {}

  async execute({ userId, deviceId }: TerminateAuthSessionDeviceByIdCommand) {
    const authSessionDevice =
      await this.authDeviceSessionsRepository.findAuthDeviceSessionByDeviceIdOrNotFoundFail(
        deviceId,
      );

    if (authSessionDevice.isDeviceOwner(userId)) {
      await this.authDeviceSessionsRepository.deleteDeviceSessionById(deviceId);
    }
  }
}
