// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, ROLES_KEY } from '../constants/roles'; // Importamos ROLES_KEY y UserRole

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // Si no se especifica @Roles, permitir acceso
    }

    const { user } = context.switchToHttp().getRequest();
    // Verifica si el usuario tiene al menos uno de los roles requeridos
    return requiredRoles.some((role) => user.role === role);
  }
}

