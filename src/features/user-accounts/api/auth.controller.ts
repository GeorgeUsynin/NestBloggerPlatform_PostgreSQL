import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { ExtractUserFromRequest } from '../guards/decorators/params/ExtractUserFromRequest.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { RefreshTokenContextDto } from '../guards/dto/refresh-token-context.dto';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { JwtHeaderAuthGuard } from '../guards/bearer/jwt-header-auth.guard';
import { JwtCookieAuthGuard } from '../guards/bearer/jwt-cookie-auth.guard';
import { CreateUserInputDto } from './dto/input-dto/create/users.input-dto';
import { RegistrationConfirmationInputDto } from './dto/input-dto/registration-confirmation.input-dto';
import { RegistrationEmailResendingInputDto } from './dto/input-dto/registration-email-resending.input-dto';
import { PasswordRecoveryInputDto } from './dto/input-dto/password-recovery.input-dto';
import { NewPasswordInputDto } from './dto/input-dto/new-password.input-dto';
import { MeViewDto } from './dto/view-dto/user.view-dto';
import { LoginSuccessViewDto } from './dto/view-dto/login-success.view-dto';
import { RefreshTokenSuccessViewDto } from './dto/view-dto/refresh-token-success.view-dto';
import { AuthQueryRepository } from '../infrastructure/query/auth.query-repository';
import {
  LoginApi,
  MeApi,
  PasswordRecoveryApi,
  RegistrationApi,
  RegistrationConfirmationApi,
  RegistrationEmailResendingApi,
} from './swagger';
import { NewPasswordApi } from './swagger/auth/new-password.decorator';
import { LogoutApi } from './swagger/auth/logout.decorator';
import { RefreshTokenApi } from './swagger/auth/refresh-token.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  ChangePasswordCommand,
  LoginCommand,
  LoginUseCaseResponse,
  LogoutCommand,
  RecoverPasswordCommand,
  RefreshTokensCommand,
  RefreshTokensUseCaseResponse,
  RegisterUserCommand,
  RegistrationConfirmationCommand,
  RegistrationEmailResendingCommand,
} from '../application/use-cases';
import { ThrottlerGuard, SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
// @UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private authQueryRepository: AuthQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @MeApi()
  @SkipThrottle()
  async me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginApi()
  async login(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<LoginSuccessViewDto> {
    const userAgent = request.header('user-agent');
    const clientIp = request.ip || '';

    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginCommand,
      LoginUseCaseResponse
    >(new LoginCommand(user.id, clientIp, userAgent));

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }

  @ApiBearerAuth()
  @UseGuards(JwtCookieAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @LogoutApi()
  @SkipThrottle()
  async logout(
    @ExtractUserFromRequest() user: RefreshTokenContextDto,
  ): Promise<void> {
    return this.commandBus.execute(new LogoutCommand(user.id, user.deviceId));
  }

  @ApiBearerAuth()
  @UseGuards(JwtCookieAuthGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @RefreshTokenApi()
  @SkipThrottle()
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @ExtractUserFromRequest() user: RefreshTokenContextDto,
  ): Promise<RefreshTokenSuccessViewDto> {
    const { accessToken, refreshToken } = await this.commandBus.execute<
      RefreshTokensCommand,
      RefreshTokensUseCaseResponse
    >(new RefreshTokensCommand(user.id, user.deviceId));

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationApi()
  async registration(@Body() body: CreateUserInputDto): Promise<void> {
    return this.commandBus.execute(new RegisterUserCommand(body));
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationConfirmationApi()
  async registrationConfirmation(
    @Body() body: RegistrationConfirmationInputDto,
  ): Promise<void> {
    const { code } = body;

    return this.commandBus.execute(new RegistrationConfirmationCommand(code));
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationEmailResendingApi()
  async registrationEmailResending(
    @Body() body: RegistrationEmailResendingInputDto,
  ): Promise<void> {
    const { email } = body;

    return this.commandBus.execute(
      new RegistrationEmailResendingCommand(email),
    );
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @PasswordRecoveryApi()
  async passwordRecovery(
    @Body() body: PasswordRecoveryInputDto,
  ): Promise<void> {
    const { email } = body;

    return this.commandBus.execute(new RecoverPasswordCommand(email));
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @NewPasswordApi()
  async newPassword(@Body() body: NewPasswordInputDto): Promise<void> {
    const { newPassword, recoveryCode } = body;

    return this.commandBus.execute(
      new ChangePasswordCommand(newPassword, recoveryCode),
    );
  }
}
