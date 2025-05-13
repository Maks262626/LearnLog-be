import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ManagementClient } from 'auth0';
import { SetRoleDto } from 'src/modules/user/dto/create-user.dto';
import { UserRoleIds, UserRoleName } from 'src/modules/user/entities/user.entity';
import { UserRepository } from 'src/modules/user/user.repository';
import { ErrorMap } from 'src/shared/response/error.map';

@Injectable()
export class AuthzService {
  private readonly managementClient: ManagementClient;
  private readonly rolesMap = {
    [UserRoleName.SUPERADMIN]: UserRoleIds.SUPERADMIN,
    [UserRoleName.MANAGER]: UserRoleIds.MANAGER,
    [UserRoleName.TEACHER]: UserRoleIds.TEACHER,
    [UserRoleName.STUDENT]: UserRoleIds.STUDENT,
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    this.managementClient = new ManagementClient({
      domain: this.configService.get<string>('auth.domain'),
      clientId: this.configService.get<string>('auth.clientId'),
      clientSecret: this.configService.get<string>('auth.clientSecret'),
    });
  }

  async setUserRoleAuth0(userId: string, setRoleDto: SetRoleDto): Promise<void> {
    const user = await this.userRepository.findUser(userId);

    if (!user) {
      throw new NotFoundException(ErrorMap.USER_NOT_FOUND);
    }

    let roleId = this.rolesMap[setRoleDto.role];

    if (!roleId) {
      throw new NotFoundException(ErrorMap.FAILED_TO_GET_ROLES);
    }

    await this.removeAllRolesAuth0(user.auth0_user_id);
    await this.assignRolesAuth0(user.auth0_user_id, [roleId]);
  }
  async assignRolesAuth0(auth0UserId: string, roles: string[]): Promise<void> {
    try {
      await this.managementClient.users.assignRoles({ id: auth0UserId }, { roles });
    } catch (error) {
      throw new ForbiddenException(ErrorMap.FAILED_TO_ASSIGN_ROLES);
    }
  }
  async removeAllRolesAuth0(auth0UserId: string): Promise<void> {
    try {
      const response = await this.managementClient.users.getRoles({
        id: auth0UserId,
      });

      if (!response || !Array.isArray(response.data)) {
        throw new ForbiddenException(ErrorMap.FAILED_TO_GET_ROLES);
      }

      const roleIds = response.data.map((role) => role.id);

      if (roleIds.length > 0) {
        await this.managementClient.users.deleteRoles({ id: auth0UserId }, { roles: roleIds });
      }
    } catch (error) {
      throw new ForbiddenException(ErrorMap.FAILED_TO_REMOVE_ROLES);
    }
  }

  async getUserRolesAuth0(auth0UserId: string): Promise<string[]> {
    try {
      const response = await this.managementClient.users.getRoles({
        id: auth0UserId,
      });

      if (!response || !Array.isArray(response.data)) {
        throw new ForbiddenException(ErrorMap.FAILED_TO_GET_ROLES);
      }

      return response.data.map((role) => role.name);
    } catch (error) {
      throw new ForbiddenException(ErrorMap.FAILED_TO_GET_ROLES);
    }
  }

  async deleteUserAuth0(auth0UserId: string): Promise<void> {
    try {
      await this.managementClient.users.delete({ id: auth0UserId });
    } catch (error) {
      throw new ForbiddenException(ErrorMap.FAILED_TO_DELETE_USER);
    }
  }
}
