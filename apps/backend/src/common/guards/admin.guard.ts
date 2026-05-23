import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { JwtPayload } from '@/common/types/jwt-payload.type';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest<{ user: JwtPayload }>().user;
    if (user?.role !== 'ADMIN') throw new ForbiddenException('Admin access required.');
    return true;
  }
}
