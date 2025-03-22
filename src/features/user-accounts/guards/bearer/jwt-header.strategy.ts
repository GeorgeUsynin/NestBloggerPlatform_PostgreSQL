import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserAccountsConfig } from '../../config';
import { JwtHeaderPayloadDto, UserContextDto } from '../dto/user-context.dto';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UnauthorizedDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class JwtHeaderStrategy extends PassportStrategy(
  Strategy,
  'jwt-header',
) {
  constructor(
    protected userAccountConfig: UserAccountsConfig,
    private usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: userAccountConfig.JWT_SECRET,
    });
  }

  async validate(payload: JwtHeaderPayloadDto): Promise<UserContextDto> {
    // Checking if user exists
    const isUserExists = Boolean(
      await this.usersRepository.findUserById(Number(payload.id)),
    );

    if (!isUserExists) {
      throw UnauthorizedDomainException.create();
    }

    return { id: Number(payload.id) };
  }
}
