export class CreateEmailConfirmationDto {
  userId: number;
  isConfirmed?: boolean;
  expirationDate?: Date;
  confirmationCode?: string;
}
