export class RefreshTokenContextDto {
  id: string;
  deviceId: string;
}

export class JwtCookiePayloadDto {
  deviceId: string;
  id: string;
  exp: number;
  iat: number;
}
