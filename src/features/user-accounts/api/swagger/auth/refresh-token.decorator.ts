import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenSuccessViewDto } from '../../dto/view-dto/refresh-token-success.view-dto';

class SwaggerRefreshTokenSuccessViewDto implements RefreshTokenSuccessViewDto {
  @ApiProperty({
    type: String,
    description: 'JWT access token',
  })
  accessToken: string;
}

export const RefreshTokenApi = () => {
  return applyDecorators(
    ApiOperation({
      summary:
        'Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing) Device LastActiveDate should be overrode by issued Date of new refresh token',
    }),
    ApiOkResponse({
      type: SwaggerRefreshTokenSuccessViewDto,
      description:
        'Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds).',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
