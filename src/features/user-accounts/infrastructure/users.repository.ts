import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { CreateUserDto } from '../domain/dto/create/users.create-dto';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DBEmailConfirmation, DBPasswordRecovery, DBUser } from './types';
import { User } from '../domain/user.entity';

@Injectable()
export class UsersRepository {
  // Injection of the model through DI
  constructor(
    // TODO: remove datasource
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(dto: CreateUserDto) {
    return this.usersRepository.create(dto);
  }

  async findUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findUserByIdOrNotFoundFail(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw NotFoundDomainException.create('User not found');
    }

    return user;
  }

  async deleteAllUsers() {
    return this.usersRepository.delete({});
  }

  async save(user: User) {
    return this.usersRepository.save(user);
  }

  // Old datasource

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<DBUser | null> {
    return (
      await this.dataSource.query(
        `
      SELECT * FROM "Users"
      WHERE login = $1 OR email = $1;
      `,
        [loginOrEmail],
      )
    )[0];
  }

  async updateIsConfirmedByUserId(userId: number, isConfirmed: boolean) {
    return this.dataSource.query(
      `
      UPDATE "EmailConfirmations"
	    SET "isConfirmed" = $1
	    WHERE "userId" = $2;
      `,
      [isConfirmed, userId],
    );
  }

  async updateIsConfirmedByConfirmationCode(
    confirmationCode: string,
    isConfirmed: boolean,
  ) {
    return this.dataSource.query(
      `
      UPDATE "EmailConfirmations"
	    SET "isConfirmed" = $1
	    WHERE "confirmationCode" = $2;
      `,
      [isConfirmed, confirmationCode],
    );
  }

  async deleteUserById(userId: number) {
    return this.dataSource.query(
      `
      UPDATE "Users"
	    SET "deletedAt" = $1
	    WHERE id = $2;
      `,
      [new Date(), userId],
    );
  }

  async findEmailConfirmationByUserId(
    userId: number,
  ): Promise<DBEmailConfirmation> {
    const emailConfirmation = (
      await this.dataSource.query(
        `
      SELECT * FROM "EmailConfirmations"
      WHERE "userId" = $1;
      `,
        [userId],
      )
    )[0];

    if (!emailConfirmation) {
      throw NotFoundDomainException.create('Email confirmation not found');
    }

    return emailConfirmation;
  }

  async findEmailConfirmationByConfirmationCode(
    confirmationCode: string,
  ): Promise<DBEmailConfirmation | null> {
    return (
      (
        await this.dataSource.query(
          `
      SELECT * FROM "EmailConfirmations"
      WHERE "confirmationCode" = $1;
      `,
          [confirmationCode],
        )
      )[0] ?? null
    );
  }

  async findPasswordRecoveryByRecoveryCode(
    recoveryCode: string,
  ): Promise<DBPasswordRecovery | null> {
    return (
      (
        await this.dataSource.query(
          `
      SELECT * FROM "PasswordRecoveries"
      WHERE "recoveryCode" = $1;
      `,
          [recoveryCode],
        )
      )[0] ?? null
    );
  }

  async findUserByLogin(login: string): Promise<DBUser | null> {
    const user = (
      await this.dataSource.query(
        `
      SELECT * from "Users"
      WHERE login = $1;
      `,
        [login],
      )
    )[0];

    return user ?? null;
  }

  async findUserByEmail(email: string): Promise<DBUser | null> {
    const user = (
      await this.dataSource.query(
        `
      SELECT * from "Users"
      WHERE email = $1;
      `,
        [email],
      )
    )[0];

    return user ?? null;
  }

  async updateEmailConfirmation(
    userId: number,
    code: string,
    expirationDate: Date,
  ) {
    return this.dataSource.query(
      `
      UPDATE "EmailConfirmations"
	    SET "confirmationCode" = $1, "expirationDate" = $2
	    WHERE "userId" = $3;      
      `,
      [code, expirationDate, userId],
    );
  }

  async updatePasswordRecovery(
    userId: number,
    code: string,
    expirationDate: Date,
  ) {
    /**
     * 1. INSERT пробует вставить новую запись.
     * 2. ON CONFLICT ("userId") означает, что если userId уже существует, не нужно выбрасывать ошибку.
     * 3. DO UPDATE SET обновляет recoveryCode и expirationDate, используя EXCLUDED (это ссылка на новые значения, переданные в INSERT).
     * EXCLUDED — это специальное имя таблицы (псевдотаблица) в PostgreSQL, которое используется в конструкции ON CONFLICT ... DO UPDATE.
     * Когда происходит конфликт (например, при попытке вставить запись с уже существующим userId), EXCLUDED содержит значения, которые пытались вставить с INSERT, но не прошли из-за конфликта.
     */
    return this.dataSource.query(
      `
      INSERT INTO "PasswordRecoveries" ("userId", "recoveryCode", "expirationDate")
      VALUES ($1, $2, $3)
      ON CONFLICT ("userId") 
      DO UPDATE SET "recoveryCode" = EXCLUDED."recoveryCode",
                    "expirationDate" = EXCLUDED."expirationDate";
      `,
      [userId, code, expirationDate],
    );
  }

  async updateUsersPassword(userId: number, newPassword: string) {
    return this.dataSource.query(
      `
      UPDATE "Users"
      SET "passwordHash" = $1
      WHERE id = $2;       
      `,
      [newPassword, userId],
    );
  }
}
