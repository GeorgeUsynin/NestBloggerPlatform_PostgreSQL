export class DBUser {
  id: number;
  login: string;
  email: string;
  createdAt: Date;
  passwordHash: string;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class DBEmailConfirmation {
  userId: number;
  isConfirmed: boolean;
  expirationDate: Date | null;
  confirmationCode: string | null;
}

export class DBPasswordRecovery {
  userId: number;
  expirationDate: Date | null;
  recoveryCode: string | null;
}
