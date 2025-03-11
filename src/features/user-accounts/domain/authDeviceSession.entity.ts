import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { ForbiddenDomainException } from '../../../core/exceptions/domain-exceptions';
import { CreateAuthDeviceSessionDto } from './dto/create/authDeviceSessions.create-dto';
import { UpdateAuthDeviceSessionDto } from './dto/update/authDeviceSessions.update-dto';

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class AuthDeviceSession {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true, unique: true })
  deviceId: string;

  @Prop({ type: String, required: true })
  issuedAt: string;

  @Prop({ type: String, required: true })
  deviceName: string;

  @Prop({ type: String, required: true })
  clientIp: string;

  @Prop({ type: String, required: true })
  expirationDateOfRefreshToken: string;

  static createAuthDeviceSession(
    dto: CreateAuthDeviceSessionDto,
  ): AuthDeviceSessionDocument {
    // AuthDeviceSessionDocument!
    const authDeviceSession = new this(); //AuthDeviceSessionModel!

    authDeviceSession.clientIp = dto.clientIp;
    authDeviceSession.deviceId = dto.deviceId;
    authDeviceSession.expirationDateOfRefreshToken =
      dto.expirationDateOfRefreshToken;
    authDeviceSession.deviceName = dto.deviceName;
    authDeviceSession.issuedAt = dto.issuedAt;
    authDeviceSession.userId = dto.userId;

    return authDeviceSession as AuthDeviceSessionDocument;
  }

  isDeviceOwner(userId: string) {
    if (this.userId !== userId) {
      throw ForbiddenDomainException.create(
        'You are not an owner of the device',
      );
    }

    return true;
  }

  update(dto: UpdateAuthDeviceSessionDto) {
    this.issuedAt = dto.issuedAt;
    this.expirationDateOfRefreshToken = dto.expirationDateOfRefreshToken;
  }
}

export const AuthDeviceSessionSchema =
  SchemaFactory.createForClass(AuthDeviceSession);

// Registers the entity methods in the schema
AuthDeviceSessionSchema.loadClass(AuthDeviceSession);

// Type of the document
export type AuthDeviceSessionDocument = HydratedDocument<AuthDeviceSession> &
  SchemaTimestampsConfig;

// Type of the model + static methods
export type AuthDeviceSessionModelType = Model<AuthDeviceSessionDocument> &
  typeof AuthDeviceSession;
