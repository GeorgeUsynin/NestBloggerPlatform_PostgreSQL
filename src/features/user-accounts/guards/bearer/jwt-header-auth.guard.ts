import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtHeaderAuthGuard extends AuthGuard('jwt-header') {}
