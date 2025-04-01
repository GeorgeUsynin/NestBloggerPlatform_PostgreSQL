export class DBAuthDeviceSession {
  deviceId: string;
  userId: number;
  issuedAt: Date;
  deviceName: string;
  clientIp: string;
  expirationDateOfRefreshToken: Date;
}
