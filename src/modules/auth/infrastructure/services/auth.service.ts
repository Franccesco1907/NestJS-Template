// src/modules/auth/infrastructure/services/auth.service.ts
import type { TokenIssuerPort } from '@modules/auth/application/ports';
import { JwtPayload } from '@modules/auth/domain/entities';
import type { User } from '@modules/users/domain/models';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements TokenIssuerPort {
  constructor(private readonly jwtService: JwtService) { }

  issue(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  async login(user: User): Promise<string> {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as JwtPayload['role'],
    };
    return this.issue(payload);
  }
}
