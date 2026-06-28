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
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa ConfigModule para usar ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' }, // Token expira en 60 minutos
      }),
      inject: [ConfigService], // Inyecta ConfigService
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
  exports: [AuthService, JwtModule, PassportModule], // Exporta JwtModule y PassportModule para que otros módulos puedan usar JWT
})
export class AuthModule {}
