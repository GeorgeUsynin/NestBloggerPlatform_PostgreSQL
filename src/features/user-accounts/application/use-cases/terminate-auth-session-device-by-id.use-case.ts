import { validate as isUUID } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthDeviceSessionsRepository } from '../../infrastructure/authDeviceSessions.repository';
import {
  ForbiddenDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';

export class TerminateAuthSessionDeviceByIdCommand {
  constructor(
    public readonly userId: number,
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
    if (!isUUID(deviceId)) {
      throw NotFoundDomainException.create('Device not found');
    }

    const authSessionDevice =
      await this.authDeviceSessionsRepository.findAuthDeviceSessionByDeviceIdOrNotFoundFail(
        deviceId,
      );

    // Is device owner check
    if (authSessionDevice.userId === userId) {
      await this.authDeviceSessionsRepository.deleteDeviceSessionById(deviceId);
    } else {
      throw ForbiddenDomainException.create(
        'You are not an owner of the device',
      );
    }
  }
}
