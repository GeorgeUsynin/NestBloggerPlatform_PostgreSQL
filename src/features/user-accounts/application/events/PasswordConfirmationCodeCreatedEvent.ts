export class PasswordConfirmationCodeCreatedEvent {
  constructor(
    public readonly email: string,
    public readonly confirmationCode: string,
  ) {}
}
