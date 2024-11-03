import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMap } from 'src/shared/response/error.map';
import { AuthzService } from './authz.service';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly authzService: AuthzService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) throw new UnauthorizedException(ErrorMap.AUTH_ERROR);

    const request = context.switchToHttp().getRequest();
    const auth0UserId = request.user.auth0_user_id;

    try {
      const roles = await this.authzService.getUserRolesAuth0(auth0UserId);

      if (roles.length !== 1) {
        throw new ForbiddenException(
          'User must have exactly one role assigned',
        );
      }
      request.user.role = roles[0];
      console.log(request.user);

      return true;
    } catch (error) {
      throw new UnauthorizedException(ErrorMap.FAILED_TO_GET_ROLES);
    }
  }
}
