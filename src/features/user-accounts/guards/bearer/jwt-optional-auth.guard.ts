import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * In the homework assignment, there is a case where we need to check the token
 * and extract data from it, but we shouldn't block the request for an anonymous user.
 * To achieve this, we can use a similar guard by overriding handleRequest.
 * https://docs.nestjs.com/recipes/passport#extending-guards
 */
@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt-header') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    /**
     * super.handleRequest(err, user, info, context, status);
     * We will not call the base method of the superclass here, because it contains the following logic:
     * Throws an error if there is no user or if there is another error (e.g., expired JWT)...
     * handleRequest(err, user, info, context, status) {
       if (err || !user) {
         throw err || new common_1.UnauthorizedException();
       }
         return user;
       }
     * Instead, we will simply return null and not process the error and null value.
     */
    if (err || !user) {
      return null;
    } else {
      return user;
    }
  }
}
