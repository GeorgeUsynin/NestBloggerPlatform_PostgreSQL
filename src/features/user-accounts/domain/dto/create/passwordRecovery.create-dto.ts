export class CreatePasswordRecoveryDto {
  userId: number;
  expirationDate: Date;
  recoveryCode: string;
}
