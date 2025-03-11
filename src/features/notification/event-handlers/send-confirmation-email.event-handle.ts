import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PasswordConfirmationCodeCreatedEvent } from '../../user-accounts/application/events/PasswordConfirmationCodeCreatedEvent';
import { EmailManager } from '../email.manager';

// https://docs.nestjs.com/recipes/cqrs#events
@EventsHandler(PasswordConfirmationCodeCreatedEvent)
export class SendConfirmationEmailEventHandler
  implements IEventHandler<PasswordConfirmationCodeCreatedEvent>
{
  constructor(private emailManager: EmailManager) {}

  handle(event: PasswordConfirmationCodeCreatedEvent) {
    /**
     * Hint
     * Be aware that when you start using event handlers you get out of the traditional HTTP web context.
     * Errors in CommandHandlers can still be caught by built-in Exception filters.
     * Errors in EventHandlers can't be caught by Exception filters: you will have to handle them manually. Either by a simple try/catch, using Sagas by triggering a compensating event, or whatever other solution you choose.
     * HTTP Responses in CommandHandlers can still be sent back to the client.
     * HTTP Responses in EventHandlers cannot. If you want to send information to the client you could use WebSocket, SSE, or whatever other solution you choose.
     */

    this.emailManager.sendPasswordConfirmationEmail(
      event.email,
      event.confirmationCode,
    );
  }
}
