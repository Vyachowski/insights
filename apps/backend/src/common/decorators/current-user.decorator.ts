import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { JwtPayload } from '@/common/types/jwt-payload.type';

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>().user,
);
