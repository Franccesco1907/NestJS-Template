import type { LoginCommand, LoginOutput } from '@modules/auth/application/dto';
import { TOKEN_ISSUER, TokenIssuerPort } from '@modules/auth/application/ports';
import { FindUserByEmailUseCase } from '@modules/users/application/use-cases/find-user-by-email';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    @Inject(TOKEN_ISSUER)
    private readonly tokenIssuer: TokenIssuerPort,
  ) { }

  async execute(loginDto: LoginCommand): Promise<LoginOutput> {
    const user = await this.findUserByEmailUseCase.execute({
      email: loginDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    const accessToken = await this.tokenIssuer.issue({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    return { accessToken };
  }
}
