export class CreateAuthDeviceSessionDto {
  userId: number;
  deviceId: string;
  issuedAt: Date;
  deviceName: string;
  clientIp: string;
  expirationDateOfRefreshToken: Date;
}
