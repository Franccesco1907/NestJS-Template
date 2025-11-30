// src/modules/auth/infrastructure/services/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@modules/auth/domain/entities';
import { UserEntity } from '@modules/users/domain/entities';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }

  async login(user: UserEntity): Promise<string> {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  // Puedes añadir un método para validar el usuario (ej. desde la estrategia JWT)
  async validateUserById(userId: string): Promise<UserEntity | null> {
    // Aquí deberías inyectar el IUserRepository y buscar el usuario por ID
    // Por simplicidad, este método es solo un placeholder, la lógica real estará en JwtStrategy
    return null;
  }
}

