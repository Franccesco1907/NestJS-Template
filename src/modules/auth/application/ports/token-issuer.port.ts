import type { JwtPayload } from '@modules/auth/domain/entities';

export const TOKEN_ISSUER = 'TOKEN_ISSUER';

export interface TokenIssuerPort {
  issue(payload: JwtPayload): Promise<string> | string;
}
