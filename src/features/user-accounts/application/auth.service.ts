import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { CryptoService } from './crypto.service';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { UnauthorizedDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UserContextDto | null> {
    const user =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      return null;
    }

    // check if user's email is confirmed
    if (!user.emailConfirmation.isConfirmed) {
      throw UnauthorizedDomainException.create('Email is not confirmed');
    }

    const isValidPassword = await this.cryptoService.comparePassword(
      password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      return null;
    }

    return { id: user._id.toString() };
  }
}
