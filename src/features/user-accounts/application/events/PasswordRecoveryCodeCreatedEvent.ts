export class PasswordRecoveryCodeCreatedEvent {
  constructor(
    public readonly email: string,
    public readonly confirmationCode: string,
  ) {}
}
