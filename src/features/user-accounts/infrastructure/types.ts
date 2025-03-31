export class DBUser {
  id: number;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class DBEmailConfirmation {
  userId: number;
  isConfirmed: boolean;
  expirationDate: Date | null;
  confirmationCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class DBPasswordRecovery {
  userId: number;
  expirationDate: Date | null;
  recoveryCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class DBAuthDeviceSession {
  deviceId: string;
  userId: number;
  issuedAt: Date;
  deviceName: string;
  clientIp: string;
  expirationDateOfRefreshToken: Date;
}
