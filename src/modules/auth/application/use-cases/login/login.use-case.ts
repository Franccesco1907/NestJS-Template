import { LoginDto } from "@modules/auth/infrastructure/dto";
import { AuthService } from "@modules/auth/infrastructure/services";
import { FindUserByEmailUseCase } from "@modules/users/application/use-cases/find-user-by-email";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly authService: AuthService,
  ) { }

  async execute(loginDto: LoginDto): Promise<{ accessToken: string }> {
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

    const accessToken = await this.authService.login(user);
    return { accessToken };
  }
}

