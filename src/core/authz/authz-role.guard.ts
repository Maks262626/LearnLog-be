import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/modules/user/user.service';
import { ErrorMap } from 'src/shared/response/error.map';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly userService: UserService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) throw new UnauthorizedException(ErrorMap.AUTH_ERROR);

    const request = context.switchToHttp().getRequest();
    const auth0UserId = request.user.auth0_user_id;

    try {
      const roles = await this.userService.getUserRoles(auth0UserId);
      if (roles.length !== 1) {
        throw new ForbiddenException(
          'User must have exactly one role assigned',
        );
      }
      request.user.role = roles[0];
      return true;
    } catch (error) {
      throw new UnauthorizedException(ErrorMap.FAILED_TO_GET_ROLES);
    }
  }
}
