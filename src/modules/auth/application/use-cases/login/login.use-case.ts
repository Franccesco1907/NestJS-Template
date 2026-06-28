import type { LoginCommand, LoginOutput } from '@modules/auth/application/dto';
import { InvalidCredentialsError } from '@modules/auth/application/errors';
import type { TokenIssuerPort } from '@modules/auth/application/ports';
import type { PasswordHasherPort } from '@modules/users/application/ports';
import { FindUserByEmailUseCase } from '@modules/users/application/use-cases/find-user-by-email';

export class LoginUseCase {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly tokenIssuer: TokenIssuerPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(loginDto: LoginCommand): Promise<LoginOutput> {
    const user = await this.findUserByEmailUseCase.execute({
      email: loginDto.email,
    });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordHasher.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.tokenIssuer.issue({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    return { accessToken };
  }
}
