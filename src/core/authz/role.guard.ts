import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleName } from 'src/modules/user/entities/user.entity';
import { ErrorMap } from 'src/shared/response/error.map';

@Injectable()
export class RoleGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private allowedRoles: UserRoleName[]) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) throw new UnauthorizedException(ErrorMap.AUTH_ERROR);

    const request = context.switchToHttp().getRequest();
    const role = request.user.roles[0];

    if (!this.allowedRoles || this.allowedRoles.length === 0) {
      return false;
    }

    if (!this.allowedRoles.includes(role)) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${this.allowedRoles.join(', ')}`,
      );
    }

    return true;
  }
}

export const Role = (...roles: UserRoleName[]) => {
  return new RoleGuard(roles);
};
