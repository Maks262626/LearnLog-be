import {
  createParamDecorator,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from '../../modules/user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<Partial<User>> => {
    const logger = new Logger('CurrentUserDecorator');

    const request = ctx.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('UnauthorizedException');
    }

    logger.log(
      `CurrentUser with ID ${user.auth0_user_id} was found in request`,
    );
    return user;
  },
);
