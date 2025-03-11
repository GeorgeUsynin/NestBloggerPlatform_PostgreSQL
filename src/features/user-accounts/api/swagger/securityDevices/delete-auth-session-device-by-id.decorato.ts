import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const TerminateAuthDeviceSessionByIdApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Terminate specified device session',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'Id of session that will be terminated',
    }),
    ApiNoContentResponse({
      description: 'No Content',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiForbiddenResponse({
      description: 'If try to delete the deviceId of other user',
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};
