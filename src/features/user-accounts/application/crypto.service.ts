import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { SALT_ROUNDS } from '../constants/constants';

@Injectable()
export class CryptoService {
  constructor() {}

  async generatePasswordHash(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
