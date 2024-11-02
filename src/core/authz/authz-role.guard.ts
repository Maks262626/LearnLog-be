import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly userService: UserService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) return false;

    const request = context.switchToHttp().getRequest();
    const auth0UserId = request.user.auth0_user_id;

    try {
      const roles = await this.userService.getUserRoles(auth0UserId);
      if(roles.length === 1){
        request.user.role = roles[0];
        return true; 
      } 
      console.error('user must have 1 role');
      return false;
    } catch (error) {
      console.error('Error loading user roles:', error);
      return false; 
    }
  }
}
