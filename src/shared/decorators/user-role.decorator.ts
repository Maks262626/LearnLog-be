import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const role = request.user.role;
    if (role) {
      return role;
    }
  },
);
