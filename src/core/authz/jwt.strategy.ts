import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';
import { AuthzService } from './authz.service';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authzService: AuthzService,
    private readonly userService: UserService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `${process.env.AUTH0_ISSUER_URL}`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any): Promise<any> {
    const auth0_user_id = payload.sub;
    const roles = await this.authzService.getUserRolesAuth0(auth0_user_id);
    const user = await this.userService.getMe(auth0_user_id);
    if (user) {
      return {
        id: user.id,
        auth0_user_id,
        role: roles[0],
        faculty_id: user.faculty_id,
        university_id: user.university_id,
        group_id: user.group_id,
        first_name: user.first_name,
        last_name: user.last_name,
      };
    }
    return { auth0_user_id, role: roles[0] };
  }
}
