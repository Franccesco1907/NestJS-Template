import { TOKEN_ISSUER, type TokenIssuerPort } from '@modules/auth/application/ports';
import { LoginUseCase } from '@modules/auth/application/use-cases/login';
import { PASSWORD_HASHER, type PasswordHasherPort } from '@modules/users/application/ports';
import { FindUserByEmailUseCase } from '@modules/users/application/use-cases/find-user-by-email';
import { UsersModule } from '@modules/users/infrastructure/controllers';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../services';
import { JwtStrategy } from '../strategies';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule so ConfigService is available
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' }, // Token expires in 60 minutes
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: TOKEN_ISSUER,
      useExisting: AuthService,
    },
    JwtStrategy,
    {
      provide: LoginUseCase,
      useFactory: (
        findUserByEmailUseCase: FindUserByEmailUseCase,
        tokenIssuer: TokenIssuerPort,
        passwordHasher: PasswordHasherPort,
      ) => new LoginUseCase(findUserByEmailUseCase, tokenIssuer, passwordHasher),
      inject: [FindUserByEmailUseCase, TOKEN_ISSUER, PASSWORD_HASHER],
    },
  ],
  exports: [AuthService, JwtModule, PassportModule], // Export JwtModule and PassportModule so other modules can use JWT
})
export class AuthModule {}
