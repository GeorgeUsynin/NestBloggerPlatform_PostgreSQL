import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { CreateUserDto } from './dto/create/users.create-dto';
import { BadRequestDomainException } from '../../../core/exceptions/domain-exceptions';

export enum DeletionStatus {
  NotDeleted = 'not-deleted',
  PermanentDeleted = 'permanent-deleted',
}

export const loginConstraints = {
  minLength: 3,
  maxLength: 10,
  match: /^[a-zA-Z0-9_-]*$/,
};

export const passwordConstraints = {
  minLength: 6,
  maxLength: 20,
};

export const emailConstraints = {
  match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, unique: true, ...loginConstraints })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true, unique: true, ...emailConstraints })
  email: string;

  @Prop({ enum: DeletionStatus, default: DeletionStatus.NotDeleted })
  deletionStatus: DeletionStatus;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({
    type: {
      isConfirmed: Boolean,
      confirmationCode: String,
      expirationDate: Date,
    },
    default: {
      isConfirmed: false,
      confirmationCode: null,
      expirationDate: null,
    }, // Set default object
    _id: false,
  })
  emailConfirmation: {
    isConfirmed: boolean;
    confirmationCode: string | null;
    expirationDate: Date | null;
  };

  @Prop({
    type: {
      recoveryCode: String,
      expirationDate: Date,
    },
    default: {
      recoveryCode: null,
      expirationDate: null,
    }, // Set default object
    _id: false,
  })
  passwordRecovery: {
    recoveryCode: string;
    expirationDate: Date | null;
  };

  static createUser(dto: CreateUserDto): UserDocument {
    // UserDocument!
    const user = new this(); //UserModel!

    user.email = dto.email;
    user.passwordHash = dto.password;
    user.login = dto.login;

    return user as UserDocument;
  }

  setConfirmationCode(code: string, expirationDate: Date) {
    if (this.emailConfirmation.isConfirmed) {
      throw BadRequestDomainException.create(
        'The user has already been confirmed',
        'email',
      );
    }

    if (!code) {
      throw new Error('Code is not provided');
    }

    this.emailConfirmation.confirmationCode = code;
    this.emailConfirmation.expirationDate = expirationDate;
  }

  confirmUserEmail(code: string) {
    if (this.emailConfirmation.isConfirmed) {
      throw BadRequestDomainException.create('Email already confirmed', 'code');
    }

    if (this.emailConfirmation.confirmationCode !== code) {
      throw BadRequestDomainException.create('Invalid code', 'code');
    }

    if (!this.emailConfirmation.expirationDate) {
      throw new Error('Expiration date for email confirmation is not set');
    }

    if (Date.now() > this.emailConfirmation.expirationDate.getTime()) {
      throw BadRequestDomainException.create('Code expired', 'code');
    }

    this.emailConfirmation.isConfirmed = true;
  }

  setPasswordRecoveryCode(code: string, expirationDate: Date) {
    if (!code) {
      throw new Error('Code is not provided');
    }

    this.passwordRecovery.recoveryCode = code;
    this.passwordRecovery.expirationDate = expirationDate;
  }

  changePassword(code: string, passwordHash: string) {
    if (this.passwordRecovery.recoveryCode !== code) {
      throw BadRequestDomainException.create('Invalid code', 'code');
    }

    if (!this.passwordRecovery.expirationDate) {
      throw new Error('Expiration date for email confirmation is not set');
    }

    if (Date.now() > this.passwordRecovery.expirationDate.getTime()) {
      throw BadRequestDomainException.create('Code expired', 'recoveryCode');
    }

    this.passwordHash = passwordHash;
  }

  makeDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('Entity has already been deleted');
    }

    this.deletionStatus = DeletionStatus.PermanentDeleted;
    this.deletedAt = new Date();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Registers the entity methods in the schema
UserSchema.loadClass(User);

// Type of the document
export type UserDocument = HydratedDocument<User> & SchemaTimestampsConfig;

// Type of the model + static methods
export type UserModelType = Model<UserDocument> & typeof User;
