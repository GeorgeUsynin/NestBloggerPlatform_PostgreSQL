import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiProperty,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../../core/dto/swagger-errors-messages.view-dto';
import { NewPasswordInputDto } from '../../dto/input-dto/new-password.input-dto';
import { passwordConstraints } from '../../../domain/user.entity';

class SwaggerNewPasswordInputDto implements NewPasswordInputDto {
  @ApiProperty({
    type: String,
    maxLength: passwordConstraints.maxLength,
    minLength: passwordConstraints.minLength,
    description: 'New password',
  })
  newPassword: string;

  @ApiProperty({
    type: String,
    description: 'Code that be sent via Email inside link',
  })
  recoveryCode: string;
}

export const NewPasswordApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Confirm password recovery',
    }),
    ApiBody({ type: SwaggerNewPasswordInputDto, required: false }),
    ApiNoContentResponse({
      description: 'If code is valid and new password is accepted',
    }),
    ApiBadRequestResponse({
      type: SwaggerErrorsMessagesViewDto,
      description:
        'If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired',
    }),
    ApiTooManyRequestsResponse({
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
};
