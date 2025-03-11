import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserViewDto } from '../../dto/view-dto/user.view-dto';
import { ApiPaginatedResponse } from '../../../../../core/decorators/swagger/ApiPaginatedResponse.decorator';

export const GetAllUsersApi = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Returns users with paging' }),
    ApiPaginatedResponse(UserViewDto),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
