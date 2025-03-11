import { DomainExceptionCode } from './domain-exception-codes';

export class ErrorsMessages {
  constructor(
    public message: string,
    public field: string | null = null,
  ) {}
}

export class DomainException extends Error {
  constructor(
    public message: string,
    public code: DomainExceptionCode,
    public errorsMessages: ErrorsMessages[],
  ) {
    super(message);
  }
}

/**
 * Using typescript mixin to create classes with the same static create method
 * https://www.typescriptlang.org/docs/handbook/mixins.html
 */
function ConcreteDomainExceptionFactory(
  commonMessage: string,
  code: DomainExceptionCode,
) {
  return class extends DomainException {
    constructor(errorsMessages: ErrorsMessages[]) {
      super(commonMessage, code, errorsMessages);
    }

    static create(message?: string, key?: string) {
      return new this(message ? [new ErrorsMessages(message, key)] : []);
    }
  };
}

export const NotFoundDomainException = ConcreteDomainExceptionFactory(
  'Not Found',
  DomainExceptionCode.NotFound,
);
export const BadRequestDomainException = ConcreteDomainExceptionFactory(
  'Bad Request',
  DomainExceptionCode.BadRequest,
);
export const ForbiddenDomainException = ConcreteDomainExceptionFactory(
  'Forbidden',
  DomainExceptionCode.Forbidden,
);
export const UnauthorizedDomainException = ConcreteDomainExceptionFactory(
  'Unauthorized',
  DomainExceptionCode.Unauthorized,
);

// Creating classes without mixins

// export class BadRequestDomainException extends DomainException {
//   constructor(errorsMessages: ErrorExtension[]) {
//     super('Bad Request', DomainExceptionCode.BedRequest, errorsMessages);
//   }
//
//   static create(message: string, key?: string) {
//     return new this(message ? [new ErrorExtension(message, key)] : []);
//   }
// }
//
// export class ForbiddenDomainException extends DomainException {
//   constructor(errorsMessages: ErrorExtension[]) {
//     super('Forbidden', DomainExceptionCode.Forbidden, errorsMessages);
//   }
//
//   static create(message?: string, key?: string) {
//     return new this(message ? [new ErrorExtension(message, key)] : []);
//   }
// }
//
// export class UnauthorizedDomainException extends DomainException {
//   constructor(errorsMessages: ErrorExtension[]) {
//     super('Unauthorized', DomainExceptionCode.Unauthorized, errorsMessages);
//   }
//
//   static create(message: string, key?: string) {
//     return new this(message ? [new ErrorExtension(message, key)] : []);
//   }
// }
