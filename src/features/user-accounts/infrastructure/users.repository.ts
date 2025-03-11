import { InjectModel } from '@nestjs/mongoose';
import {
  DeletionStatus,
  User,
  UserDocument,
  UserModelType,
} from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class UsersRepository {
  // Injection of the model through DI
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async findUserByIdOrNotFoundFail(id: string): Promise<UserDocument> {
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
}
