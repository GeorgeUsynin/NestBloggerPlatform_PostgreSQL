export class CreateAuthDeviceSessionDto {
  userId: string;
  deviceId: string;
  issuedAt: string;
  deviceName: string;
  clientIp: string;
  expirationDateOfRefreshToken: string;
}
