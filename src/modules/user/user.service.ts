import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthzService } from 'src/core/authz/authz.service';
import { ErrorMap } from 'src/shared/response/error.map';
import { CreateUserDto, SetRoleDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRoleName } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UserRepository,
    @Inject(forwardRef(() => AuthzService))
    private readonly authzService: AuthzService,
  ) {}

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

  async getUserMe(auth0_user_id: string) {
    const user = await this.usersRepository.getUserMe(auth0_user_id);
    if (!user || !this.checkIfAllFieldsCompleted(user)) {
      return { is_registration_completed: false };
    }
    await this.updateRegistrationStatus(user.id, true);
    return this.getUser(user.id);
  }
  async setUserRole(
    userId: string,
    setRoleDto: SetRoleDto,
    role: UserRoleName,
  ): Promise<void> {
    //if i am superamin - i can do anything,
    //if i am manager   - i can do anything except seting superadmin
    if (
      role === UserRoleName.SUPERADMIN ||
      (role === UserRoleName.MANAGER &&
        setRoleDto.role !== UserRoleName.SUPERADMIN)
    ) {
      console.log('role', role);

      this.authzService.setUserRoleAuth0(userId, setRoleDto);
      this.usersRepository.updateUserRole(userId, setRoleDto.role);
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
