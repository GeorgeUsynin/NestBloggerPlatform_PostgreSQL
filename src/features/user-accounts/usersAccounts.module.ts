import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './api/users.controller';
import { UserSchema, User } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { AuthDeviceSessionsRepository } from './infrastructure/authDeviceSessions.repository';
import { AuthDeviceSessionQueryRepository } from './infrastructure/query/authDeviceSessions.query-repository';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { AuthService } from './application/auth.service';
import { RegistrationService } from './application/registration.service';
import { CryptoService } from './application/crypto.service';
import { AuthController } from './api/auth.controller';
import { LocalStrategy } from './guards/local/local.strategy';
import { JwtHeaderStrategy } from './guards/bearer/jwt-header.strategy';
import { JwtCookieStrategy } from './guards/bearer/jwt-cookie.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserAccountsConfig } from './config';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants';
import {
  ChangePasswordUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  LoginUseCase,
  LogoutUseCase,
  RecoverPasswordUseCase,
  RefreshTokensUseCase,
  RegisterUserUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  TerminateAllAuthSessionDevicesExceptCurrentUseCase,
  TerminateAuthSessionDeviceByIdUseCase,
} from './application/use-cases';
import {
  AuthDeviceSession,
  AuthDeviceSessionSchema,
} from './domain/authDeviceSession.entity';
import { SecurityDevicesController } from './api/securityDevices.controller';

const mongooseModels = [
  { name: User.name, schema: UserSchema },
  { name: AuthDeviceSession.name, schema: AuthDeviceSessionSchema },
];
const useCases = [
  CreateUserUseCase,
  DeleteUserUseCase,
  RegisterUserUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  ChangePasswordUseCase,
  RecoverPasswordUseCase,
  LoginUseCase,
  RefreshTokensUseCase,
  LogoutUseCase,
  TerminateAllAuthSessionDevicesExceptCurrentUseCase,
  TerminateAuthSessionDeviceByIdUseCase,
];
const strategies = [LocalStrategy, JwtHeaderStrategy, JwtCookieStrategy];
const repositories = [UsersRepository, AuthDeviceSessionsRepository];
const queryRepositories = [
  UsersQueryRepository,
  AuthQueryRepository,
  AuthDeviceSessionQueryRepository,
];
const services = [AuthService, CryptoService, RegistrationService];

@Module({
  // This will allow injecting the UserModel into the providers in this module
  imports: [MongooseModule.forFeature(mongooseModels), JwtModule],
  controllers: [AuthController, UsersController, SecurityDevicesController],
  providers: [
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.JWT_SECRET,
          signOptions: {
            expiresIn: userAccountConfig.ACCESS_TOKEN_EXPIRATION_TIME,
          },
        });
      },
      inject: [UserAccountsConfig],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.JWT_SECRET,
          signOptions: {
            expiresIn: userAccountConfig.REFRESH_TOKEN_EXPIRATION_TIME,
          },
        });
      },
      inject: [UserAccountsConfig],
    },

    UserAccountsConfig,
    ...repositories,
    ...queryRepositories,
    ...services,
    ...strategies,
    ...useCases,
  ],
  exports: [MongooseModule, UsersRepository, UserAccountsConfig],
  /* We re-export the MongooseModule if we want the models registered here to be injectable 
  into the services of other modules that import this module */
})
export class UsersAccountsModule {}
