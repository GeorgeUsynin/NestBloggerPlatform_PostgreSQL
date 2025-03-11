import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthDeviceSessionViewDto } from '../../dto/view-dto/authDeviceSession.view-dto';

export const GetAllAuthSessionDevicesApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns all devices with active sessions for current user',
    }),
    ApiOkResponse({
      type: AuthDeviceSessionViewDto,
      isArray: true,
      description: 'Success',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
