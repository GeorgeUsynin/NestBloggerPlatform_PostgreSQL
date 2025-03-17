import { InjectModel } from '@nestjs/mongoose';
import {
  DeletionStatus,
  User,
  UserDocument,
  UserModelType,
} from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';
import { CreateUserDto } from '../domain/dto/create/users.create-dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DBEmailConfirmation, DBPasswordRecovery, DBUser } from './types';

@Injectable()
export class UsersRepository {
  // Injection of the model through DI
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findUserByIdOrNotFoundFail(id: number): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    });

    if (!user) {
      throw NotFoundDomainException.create('User not found');
    }

    return user;
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return await this.UserModel.findOne({
      _id: id,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    });
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    return this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async findUserByLogin(login: string) {
    return this.UserModel.findOne({ login });
  }

  async findUserByEmail(email: string) {
    return this.UserModel.findOne({ email });
  }

  async findUserByConfirmationEmailCode(code: string) {
    return this.UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async findUserByRecoveryPasswordCode(code: string) {
    return this.UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
  }

  async save(user: UserDocument) {
    await user.save();
  }

  // POSTGRESQL

  async findUserByIdSQL(id: number): Promise<DBUser | null> {
    return (
      await this.dataSource.query(
        `
         SELECT * FROM "Users"
         WHERE id = $1 AND "deletedAt" IS NULL;
         `,
        [id],
      )
    )[0];
  }

  async createUser(dto: CreateUserDto) {
    const { email, login, password } = dto;

    const query = `
      WITH inserted_user AS (
        INSERT INTO "Users" (email, "passwordHash", login)
        VALUES ($1, $2, $3)
        RETURNING id
      ),
      email_confirmation AS (
        INSERT INTO "EmailConfirmations" ("userId")
        SELECT id FROM inserted_user
      )
      SELECT id FROM inserted_user;
    `;

    const { id } = (
      await this.dataSource.query(query, [email, password, login])
    )[0];

    return id;
  }

  async findUserByLoginOrEmailSQL(
    loginOrEmail: string,
  ): Promise<DBUser | null> {
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

  async findUserByIdOrNotFoundFailSQL(id: number): Promise<DBUser> {
    const user: DBUser = (
      await this.dataSource.query(
        `
         SELECT * FROM "Users"
         WHERE id = $1 AND "deletedAt" IS NULL;
         `,
        [id],
      )
    )[0];

    if (!user) {
      throw NotFoundDomainException.create('User not found');
    }

    return user;
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

  async findUserByLoginSQL(login: string): Promise<DBUser | null> {
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

  async findUserByEmailSQL(email: string): Promise<DBUser | null> {
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

  async updateEmailConfirmationSQL(
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

  async updatePasswordRecoverySQL(
    userId: number,
    code: string,
    expirationDate: Date,
  ) {
    return this.dataSource.query(
      `
      UPDATE "PasswordRecoveries"
	    SET "recoveryCode" = $1, "expirationDate" = $2
	    WHERE "userId" = $3;      
      `,
      [code, expirationDate, userId],
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
