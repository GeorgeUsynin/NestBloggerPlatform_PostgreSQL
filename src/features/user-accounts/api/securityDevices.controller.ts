import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtCookieAuthGuard } from '../guards/bearer/jwt-cookie-auth.guard';
import { RefreshTokenContextDto } from '../guards/dto/refresh-token-context.dto';
import { ExtractUserFromRequest } from '../guards/decorators/params/ExtractUserFromRequest.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { AuthDeviceSessionViewDto } from './dto/view-dto/authDeviceSession.view-dto';
import { AuthDeviceSessionQueryRepository } from '../infrastructure/query/authDeviceSessions.query-repository';
import { TerminateAllAuthSessionDevicesExceptCurrentCommand } from '../application/use-cases/terminate-all-auth-session-devices-except-current.use-case';
import { TerminateAuthSessionDeviceByIdCommand } from '../application/use-cases/terminate-auth-session-device-by-id.use-case';
import {
  GetAllAuthSessionDevicesApi,
  TerminateAuthDeviceSessionExceptCurrentApi,
} from './swagger';
import { TerminateAuthDeviceSessionByIdApi } from './swagger/securityDevices/delete-auth-session-device-by-id.decorato';

@Controller('security')
export class SecurityDevicesController {
  constructor(
    private authDeviceSessionQueryRepository: AuthDeviceSessionQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtCookieAuthGuard)
  @Get('devices')
  @HttpCode(HttpStatus.OK)
  @GetAllAuthSessionDevicesApi()
  async getAllAuthDeviceSessions(
    @ExtractUserFromRequest() user: RefreshTokenContextDto,
  ): Promise<AuthDeviceSessionViewDto[]> {
    return this.authDeviceSessionQueryRepository.getAllUserAuthDeviceSessions(
      user.id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtCookieAuthGuard)
  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  @TerminateAuthDeviceSessionExceptCurrentApi()
  async terminateAllAuthDeviceSessionsExceptCurrent(
    @ExtractUserFromRequest() user: RefreshTokenContextDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new TerminateAllAuthSessionDevicesExceptCurrentCommand(
        user.id,
        user.deviceId,
      ),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtCookieAuthGuard)
  @Delete('devices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @TerminateAuthDeviceSessionByIdApi()
  async terminateAuthDeviceSessionById(
    @Param('id') deviceId: string,
    @ExtractUserFromRequest() user: RefreshTokenContextDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new TerminateAuthSessionDeviceByIdCommand(user.id, deviceId),
    );
  }
}
