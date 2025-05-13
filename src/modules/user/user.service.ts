import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthzService } from 'src/core/authz/authz.service';
import { ErrorMap } from 'src/shared/response/error.map';
import { CreateUserDto, SetRoleDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserPolicyService } from './user-policy.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly policy: UserPolicyService,
    private readonly userRepository: UserRepository,
    private readonly authzService: AuthzService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Partial<User>> {
    try {
      const existUser = await this.getMe(createUserDto.auth0_user_id);
      if (existUser.is_registration_completed) {
        return existUser;
      }
      const user = this.userRepository.createUser({ ...createUserDto });

      return user;
    } catch (err) {
      throw new BadRequestException(ErrorMap.AUTH_ERROR);
    }
  }

  async findAllUsers() {
    return this.userRepository.findAllUsers();
  }

  findUserWithPolicy(id: string, callerUser: User) {
    if (!this.policy.isManagerHasPermission(id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }

    return this.userRepository.findUser(id);
  }

  getTeachersByFacultyId(faculty_id: string) {
    return this.userRepository.getTeachersByFacultyId(faculty_id);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateUser(id, updateUserDto);
  }

  checkIfAllFieldsCompleted(user: User): boolean {
    return Boolean(user.last_name && user.first_name);
  }

  async updateRegistrationStatus(id: string, status: boolean): Promise<void> {
    const updateUser: UpdateUserDto = { is_registration_completed: status };
    await this.updateUser(id, updateUser);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findUser(id);

    if (!user) {
      throw new BadRequestException(ErrorMap.CANNOT_FIND_MODEL);
    }

    return user;
  }

  async getMe(auth0_user_id: string): Promise<Partial<User>> {
    const user = await this.userRepository.getUserMe(auth0_user_id);
    if (!user || !this.checkIfAllFieldsCompleted(user)) {
      return { is_registration_completed: false };
    }
    await this.updateRegistrationStatus(user.id, true);
    return this.getUserById(user.id);
  }

  async setUserRole(userId: string, setRoleDto: SetRoleDto, user: User): Promise<void> {
    if (!this.policy.canAssignRole(user.role, setRoleDto.role, userId, user)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }

    await this.authzService.setUserRoleAuth0(userId, setRoleDto);
    await this.userRepository.updateUserRole(userId, setRoleDto.role);
    await this.approveUser(userId);
  }

  async removeUser(user_id: string, caller: User) {
    if (!this.policy.isManagerHasPermission(user_id, caller)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    const user = await this.findUserWithPolicy(user_id, caller);
    this.authzService.deleteUserAuth0(user.auth0_user_id);
    return this.userRepository.deleteUser(user_id);
  }

  async findUsersFromUniversity(id: string): Promise<User[]> {
    const users = await this.userRepository.findUsersFromUniversity(id);
    return users;
  }
  async findUsersFromFaculty(id: string): Promise<User[]> {
    const users = await this.userRepository.findUsersFromFaculty(id);
    return users;
  }
  async findUsersFromGroup(group_id: string, callerUser: User): Promise<User[]> {
    if (!this.policy.isManagerHasPermissionByGroupId(group_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }

    const users = await this.userRepository.findUsersFromGroup(group_id);
    return users;
  }
  async approveUser(id: string): Promise<boolean> {
    return this.userRepository.updateUser(id, { is_approved: true });
  }
}
