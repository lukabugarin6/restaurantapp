import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // No roles required, access granted
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role || !roles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}