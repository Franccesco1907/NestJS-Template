import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import type { PasswordHasherPort } from '@modules/users/application/ports';

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class BcryptPasswordHasherService implements PasswordHasherPort {
  hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, BCRYPT_SALT_ROUNDS);
  }

  compare(plainText: string, hashedText: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashedText);
  }
}
