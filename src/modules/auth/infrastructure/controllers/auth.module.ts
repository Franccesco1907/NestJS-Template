import { LoginUseCase } from '@modules/auth/application/use-cases/login';
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
    JwtStrategy,
    LoginUseCase,
  ],
  exports: [AuthService, JwtModule, PassportModule], // Exporta JwtModule y PassportModule para que otros módulos puedan usar JWT
})
export class AuthModule { }

