import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { ENV_VARIABLE_NAMES } from '../../../constants';
import { configValidationUtility } from '../../../core/config';

@Injectable()
export class UserAccountsConfig {
  @IsNumber(
    {},
    {
      message:
        'Env variable CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS must be an integer, example: 1',
    },
  )
  @IsNotEmpty({
    message:
      'Set Env variable CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS, example: 1',
  })
  [ENV_VARIABLE_NAMES.CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS]: number =
    Number(
      this.configService.get(
        ENV_VARIABLE_NAMES.CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS,
      ),
    );

  @IsNumber(
    {},
    {
      message:
        'Env variable CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS must be an integer, example: 1',
    },
  )
  @IsNotEmpty({
    message:
      'Set Env variable RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS, example: 1',
  })
  [ENV_VARIABLE_NAMES.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS]: number = Number(
    this.configService.get(
      ENV_VARIABLE_NAMES.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS,
    ),
  );

  @IsNotEmpty({
    message: 'Set Env variable ACCESS_TOKEN_EXPIRATION_TIME, example: 10m',
  })
  [ENV_VARIABLE_NAMES.ACCESS_TOKEN_EXPIRATION_TIME]: string =
    this.configService.get(
      ENV_VARIABLE_NAMES.ACCESS_TOKEN_EXPIRATION_TIME,
    ) as string;

  @IsNotEmpty({
    message: 'Set Env variable REFRESH_TOKEN_EXPIRATION_TIME, example: 1h',
  })
  [ENV_VARIABLE_NAMES.REFRESH_TOKEN_EXPIRATION_TIME]: string =
    this.configService.get(
      ENV_VARIABLE_NAMES.REFRESH_TOKEN_EXPIRATION_TIME,
    ) as string;

  @IsNotEmpty({
    message: 'Set Env variable JWT_SECRET, example: your-secret',
  })
  [ENV_VARIABLE_NAMES.JWT_SECRET]: string = this.configService.get(
    ENV_VARIABLE_NAMES.JWT_SECRET,
  ) as string;

  @IsNotEmpty({
    message: 'Set Env variable LOGIN, example: basic auth login',
  })
  [ENV_VARIABLE_NAMES.LOGIN]: string = this.configService.get(
    ENV_VARIABLE_NAMES.LOGIN,
  ) as string;

  @IsNotEmpty({
    message: 'Set Env variable PASSWORD, example: basic auth password',
  })
  [ENV_VARIABLE_NAMES.PASSWORD]: string = this.configService.get(
    ENV_VARIABLE_NAMES.PASSWORD,
  ) as string;

  @IsBoolean({
    message:
      'Set Env variable IS_USER_AUTOMATICALLY_CONFIRMED to confirm user registration, example: true, available values: true, false',
  })
  [ENV_VARIABLE_NAMES.IS_USER_AUTOMATICALLY_CONFIRMED]: boolean =
    configValidationUtility.convertToBoolean(
      this.configService.get(
        ENV_VARIABLE_NAMES.IS_USER_AUTOMATICALLY_CONFIRMED,
      ) as string,
    ) as boolean;

  constructor(private configService: ConfigService) {
    configValidationUtility.validateConfig(this);
  }
}
