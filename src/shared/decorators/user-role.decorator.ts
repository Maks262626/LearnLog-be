import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRoleName } from 'src/modules/user/entities/user.entity';

export const UserRole = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const role = request.user.role;
  if (role) {
    return role as UserRoleName;
  }
});
