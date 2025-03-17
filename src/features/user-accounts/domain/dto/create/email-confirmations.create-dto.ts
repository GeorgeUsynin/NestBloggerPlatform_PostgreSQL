export class CreateEmailConfirmationDto {
  userId: number;
  expirationDate: string | null;
  confirmationCode: string | null;
}
