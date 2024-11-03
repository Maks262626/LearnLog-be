import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SetRoleDto } from 'src/modules/user/dto/create-user.dto';
import {
  UserRoleIds,
  UserRoleName,
} from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { ErrorMap } from 'src/shared/response/error.map';

@Injectable()
export class AuthzService {
  private accessToken: string | null = null;
  private readonly auth0IssuerUrl: string;
  private readonly auth0ClientId: string;
  private readonly auth0ClientSecret: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.auth0IssuerUrl = this.configService.get<string>('auth.issuer');
    this.auth0ClientId = this.configService.get<string>('auth.clientId');
    this.auth0ClientSecret =
      this.configService.get<string>('auth.clientSecret');
  }

  async getAccessTokenAuth0(): Promise<string> {
    if (!this.accessToken) {
      const url = `${this.auth0IssuerUrl}oauth/token`;
      const payload = {
        client_id: this.auth0ClientId,
        client_secret: this.auth0ClientSecret,
        audience: `${this.auth0IssuerUrl}api/v2/`,
        grant_type: 'client_credentials',
      };

      try {
        const response = await firstValueFrom(
          this.httpService.post(url, payload),
        );
        this.accessToken = response.data.access_token;
      } catch (err) {
        throw new Error('failed to get auth token');
      }
    }
    return this.accessToken;
  }
  async setUserRoleAuth0(
    userId: string,
    setRoleDto: SetRoleDto,
  ): Promise<void> {
    const user = await this.userService.getUser(userId);
    if (!user) {
      throw new NotFoundException(ErrorMap.USER_NOT_FOUND);
    }

    let roleId: string;
    switch (setRoleDto.role) {
      case UserRoleName.SUPERADMIN:
        roleId = UserRoleIds.SUPERADMIN;
        break;
      case UserRoleName.MANAGER:
        roleId = UserRoleIds.MANAGER;
        break;
      case UserRoleName.TEACHER:
        roleId = UserRoleIds.TEACHER;
        break;
      case UserRoleName.STUDENT:
        roleId = UserRoleIds.STUDENT;
        break;
      default:
        break;
    }
    if (!roleId) {
      throw new NotFoundException(ErrorMap.FAILED_TO_GET_ROLES);
    }
    await this.removeAllRolesAuth0(user.auth0_user_id);
    await this.assignRolesAuth0(user.auth0_user_id, [roleId]);
  }
  async assignRolesAuth0(auth0UserId: string, roles: string[]): Promise<void> {
    await this.getAccessTokenAuth0();
    const url = `${this.auth0IssuerUrl}api/v2/users/${auth0UserId}/roles`;
    const payload = { roles };
    const headers = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      await firstValueFrom(this.httpService.post(url, payload, headers));
    } catch (error) {
      throw new ForbiddenException(ErrorMap.FAILED_TO_ASSIGN_ROLES);
    }
  }
  async removeAllRolesAuth0(auth0UserId: string): Promise<void> {
    await this.getAccessTokenAuth0();
    const url = `${this.auth0IssuerUrl}api/v2/users/${auth0UserId}/roles`;
    const headers = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      const currentRoles = await firstValueFrom(
        this.httpService.get(url, headers),
      );
      const roleIds = currentRoles.data.map((role: any) => role.id);

      if (roleIds.length) {
        await firstValueFrom(
          this.httpService.delete(url, {
            ...headers,
            data: { roles: roleIds },
          }),
        );
      }
    } catch (error) {
      throw new ForbiddenException(ErrorMap.FAILED_TO_REMOVE_ROLES);
    }
  }
  async getUserRolesAuth0(auth0UserId: string): Promise<string[]> {
    await this.getAccessTokenAuth0();

    const url = `${this.auth0IssuerUrl}api/v2/users/${auth0UserId}/roles`;
    const headers = {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    };

    try {
      const response = await firstValueFrom(this.httpService.get(url, headers));

      const roles: string[] = response.data.map(
        (role: { name: string }) => role.name,
      );
      return roles;
    } catch (error) {
      throw new ForbiddenException(ErrorMap.FAILED_TO_GET_ROLES);
    }
  }
}
