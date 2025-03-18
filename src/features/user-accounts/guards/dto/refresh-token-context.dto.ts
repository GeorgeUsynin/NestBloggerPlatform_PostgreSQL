export class RefreshTokenContextDto {
  id: number;
  deviceId: string;
}

export class JwtCookiePayloadDto {
  deviceId: string;
  id: string;
  exp: number;
  iat: number;
}
