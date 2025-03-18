import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthDeviceSessionsRepository } from '../../infrastructure/authDeviceSessions.repository';

export class TerminateAllAuthSessionDevicesExceptCurrentCommand {
  constructor(
    public readonly userId: number,
    public readonly deviceId: string,
  ) {}
}

@CommandHandler(TerminateAllAuthSessionDevicesExceptCurrentCommand)
export class TerminateAllAuthSessionDevicesExceptCurrentUseCase
  implements
    ICommandHandler<TerminateAllAuthSessionDevicesExceptCurrentCommand, void>
{
  constructor(
    private authDeviceSessionsRepository: AuthDeviceSessionsRepository,
  ) {}

  async execute({
    userId,
    deviceId,
  }: TerminateAllAuthSessionDevicesExceptCurrentCommand) {
    await this.authDeviceSessionsRepository.deleteAllOtherUserDeviceSessions(
      userId,
      deviceId,
    );
  }
}
