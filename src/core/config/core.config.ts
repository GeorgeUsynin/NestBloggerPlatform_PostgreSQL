import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ENV_VARIABLE_NAMES, ENVIRONMENTS } from '../../constants';
import { configValidationUtility } from './config-validation.utility';

@Injectable()
export class CoreConfig {
  @IsNumber(
    {},
    {
      message: 'Set Env variable PORT, example: 3000',
    },
  )
  [ENV_VARIABLE_NAMES.PORT]: number = Number(
    this.configService.get(ENV_VARIABLE_NAMES.PORT),
  );

  @IsEnum(ENVIRONMENTS, {
    message:
      'Ser correct NODE_ENV value, available values: ' +
      configValidationUtility.getEnumValues(ENVIRONMENTS).join(', '),
  })
  [ENV_VARIABLE_NAMES.NODE_ENV]: string = this.configService.get(
    ENV_VARIABLE_NAMES.NODE_ENV,
  ) as string;

  @IsNotEmpty({
    message: 'Set Env variable SERVER_URL, example: http://localhost:<PORT>',
  })
  [ENV_VARIABLE_NAMES.SERVER_URL]: string = this.configService.get(
    ENV_VARIABLE_NAMES.SERVER_URL,
  ) as string;

  @IsNotEmpty({
    message:
      'Set Env variable POSTGRESQL_URL, example: postgresql://localhost/',
  })
  [ENV_VARIABLE_NAMES.POSTGRESQL_URL]: string = this.configService.get(
    ENV_VARIABLE_NAMES.POSTGRESQL_URL,
  ) as string;

  @IsEmail()
  @IsNotEmpty({
    message:
      'Set Env variable EMAIL_BLOG_PLATFORM, example: example@example.com',
  })
  [ENV_VARIABLE_NAMES.EMAIL_BLOG_PLATFORM]: string = this.configService.get(
    ENV_VARIABLE_NAMES.EMAIL_BLOG_PLATFORM,
  ) as string;

  @IsNotEmpty({
    message: 'Set Env variable EMAIL_BLOG_PLATFORM_PASSWORD',
  })
  [ENV_VARIABLE_NAMES.EMAIL_BLOG_PLATFORM_PASSWORD]: string =
    this.configService.get(
      ENV_VARIABLE_NAMES.EMAIL_BLOG_PLATFORM_PASSWORD,
    ) as string;

  @IsBoolean({
    message:
      'Set Env variable IS_SWAGGER_ENABLED to enable/disable Swagger, example: true, available values: true, false',
  })
  [ENV_VARIABLE_NAMES.IS_SWAGGER_ENABLED]: boolean =
    configValidationUtility.convertToBoolean(
      this.configService.get(ENV_VARIABLE_NAMES.IS_SWAGGER_ENABLED) as string,
    ) as boolean;

  @IsBoolean({
    message:
      'Set Env variable INCLUDE_TESTING_MODULE to enable/disable Dangerous for production TestingModule, example: true, available values: true, false, 0, 1',
  })
  [ENV_VARIABLE_NAMES.INCLUDE_TESTING_MODULE]: boolean =
    configValidationUtility.convertToBoolean(
      this.configService.get(
        ENV_VARIABLE_NAMES.INCLUDE_TESTING_MODULE,
      ) as string,
    ) as boolean;

  constructor(private configService: ConfigService) {
    configValidationUtility.validateConfig(this);
  }
}
