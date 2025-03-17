export class UserContextDto {
  id: number;
}

export class JwtHeaderPayloadDto {
  id: string;
  exp: number;
  iat: number;
}
