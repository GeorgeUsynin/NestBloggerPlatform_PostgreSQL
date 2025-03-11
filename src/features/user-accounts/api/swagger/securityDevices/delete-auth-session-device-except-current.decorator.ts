import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const TerminateAuthDeviceSessionExceptCurrentApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: "Terminate all other (exclude current) device's sessions",
    }),
    ApiNoContentResponse({
      description: 'No Content',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
