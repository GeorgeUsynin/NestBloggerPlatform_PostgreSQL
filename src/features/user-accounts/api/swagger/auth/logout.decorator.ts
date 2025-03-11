import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const LogoutApi = () => {
  return applyDecorators(
    ApiOperation({
      summary:
        'In cookie client must send correct refreshToken that will be revoked',
    }),
    ApiNoContentResponse({
      description: 'No Content',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
