import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ErrorMap } from 'src/shared/response/error.map';
import { CreateUserDto, SetRoleDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRoleIds, UserRoleName } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private accessToken: string | null = null;
  private readonly auth0IssuerUrl: string;
  private readonly auth0ClientId: string;
  private readonly auth0ClientSecret: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UserRepository,
  ) {
    this.auth0IssuerUrl = this.configService.get<string>('auth.issuer');
    this.auth0ClientId = this.configService.get<string>('auth.clientId');
    this.auth0ClientSecret =
      this.configService.get<string>('auth.clientSecret');
  }
  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  async findAllUsers(role: string) {
    switch (role) {
      case UserRoleName.SUPERADMIN:
      case UserRoleName.TEACHER:
        return this.usersRepository.findAllUsers();
      case UserRoleName.STUDENT:
        const users = await this.usersRepository.findAllUsers();
        return [users[0]];
      default:
        break;
    }
  }

  findUser(id: string) {
    return this.usersRepository.findUser(id);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.updateUser(id, updateUserDto);
  }

  removeUser(id: string) {
    return this.usersRepository.deleteUser(id);
  }

  checkIfAllFieldsCompleted(user: User): boolean {
    return Boolean(user.last_name && user.first_name);
  }
  async updateRegistrationStatus(id: string, status: boolean): Promise<void> {
    const updateUser: UpdateUserDto = { is_registration_completed: status };
    await this.updateUser(id, updateUser);
  }

  async getUser(id: string): Promise<User> {
    const user = await this.usersRepository.findUser(id);

    if (!user) {
      throw new BadRequestException('Cant find a model');
    }

    return user;
  }

  async getUserMe(id: string) {
    const user = await this.usersRepository.getUserMe(id);
    if (!user || !this.checkIfAllFieldsCompleted(user)) {
      return { is_registration_completed: false };
    }
    await this.updateRegistrationStatus(user.id, true);
    return this.getUser(user.id);
  }

  async getAccessToken(): Promise<string> {
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
  async setUserRole(
    userId: string,
    setRoleDto: SetRoleDto,
    role: string,
  ): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new NotFoundException(ErrorMap.USER_NOT_FOUND);
    }

    if (
      role === UserRoleName.SUPERADMIN ||
      (role === UserRoleName.MANAGER &&
        setRoleDto.role !== UserRoleName.SUPERADMIN)
    ) {
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
      await this.removeAllRoles(user.auth0_user_id);
      await this.assignRoles(user.auth0_user_id, [roleId]);
    }
  }
  async assignRoles(auth0UserId: string, roles: string[]): Promise<void> {
    await this.getAccessToken();
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
  async removeAllRoles(auth0UserId: string): Promise<void> {
    await this.getAccessToken();
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

  async getUserRoles(auth0UserId: string): Promise<string[]> {
    await this.getAccessToken();

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
  async register(createUserDto: CreateUserDto): Promise<Partial<User>> {
    try {
      const existUser = await this.getUserMe(createUserDto.auth0_user_id);
      if (existUser.is_registration_completed) {
        return existUser;
      }
      const user = this.createUser({ ...createUserDto });

      return user;
    } catch (err) {
      throw new BadRequestException(ErrorMap.AUTH_ERROR);
    }
  }
}
