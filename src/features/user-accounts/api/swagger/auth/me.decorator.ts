import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MeViewDto } from '../../dto/view-dto/user.view-dto';

class SwaggerMeViewDto implements MeViewDto {
  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  login: string;

  @ApiProperty({ type: String })
  email: string;
}

export const MeApi = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get information about current user' }),
    ApiOkResponse({
      type: SwaggerMeViewDto,
      description: 'Success',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
