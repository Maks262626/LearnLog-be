import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { CreateUserDto, SetRoleDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRoleName } from './entities/user.entity';
import { UserService } from './user.service';
import { USER_CONTROLLER, USER_ROUTES } from './user.routes';

@UseGuards(AuthGuard('jwt'))
@Controller(USER_CONTROLLER)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(USER_ROUTES.REGISTER)
  async registerUser(@CurrentUser() user: User, @Body() createUserDto: CreateUserDto) {
    const { auth0_user_id } = user;
    return this.userService.register({ ...createUserDto, auth0_user_id });
  }

  @Get(USER_ROUTES.ME)
  async userMe(@CurrentUser() user: User): Promise<Partial<User>> {
    const { auth0_user_id } = user;

    return this.userService.getMe(auth0_user_id);
  }

  @Get(USER_ROUTES.FIND_ALL_USERS)
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @UseGuards(Role(UserRoleName.MANAGER))
  @Get(USER_ROUTES.GET_TEACHERS_BY_FACULTY_ID)
  async getTeachersByFacultyId(@Param('id') id: string): Promise<User[]> {
    return this.userService.getTeachersByFacultyId(id);
  }

  @UseGuards(Role(UserRoleName.STUDENT))
  @Get(USER_ROUTES.GET_USERS_IN_MY_GROUP)
  findUsersInMyGroup(@CurrentUser() user: User): Promise<User[]> {
    const { group_id } = user;
    return this.userService.findUsersFromGroup(group_id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN,UserRoleName.MANAGER))
  @Get(USER_ROUTES.FIND_USER)
  findUser(@Param('id') id: string, @CurrentUser() user: User) {
    return this.userService.getUser(id, user);
  }

  @Get(USER_ROUTES.FIND_USERS_FROM_UNIVERSITY)
  findUsersFromUniversity(@Param('id') id: string): Promise<User[]> {
    return this.userService.findUsersFromUniversity(id);
  }

  @Get(USER_ROUTES.FIND_USERS_FROM_FACULTY)
  findUsersFromFaculty(@Param('id') id: string): Promise<User[]> {
    return this.userService.findUsersFromFaculty(id);
  }

  @UseGuards(Role(UserRoleName.MANAGER))
  @Get(USER_ROUTES.GET_USERS_IN_MY_FACULTY)
  findUsersFromMyFaculty(@CurrentUser() user: User): Promise<User[]> {
    const { faculty_id } = user;
    return this.userService.findUsersFromFaculty(faculty_id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN,UserRoleName.MANAGER, UserRoleName.TEACHER))
  @Get(USER_ROUTES.FIND_USERS_FROM_GROUP)
  findUsersFromGroup(@Param('id') id: string, @CurrentUser() user: User): Promise<User[]> {
    return this.userService.findUsersFromGroup(id, user);
  }

  @Patch(USER_ROUTES.UPDATE_USER)
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Patch(USER_ROUTES.SET_USER_ROLE)
  @UseGuards(Role(UserRoleName.SUPERADMIN,UserRoleName.MANAGER))
  async setUserRole(
    @Param('id') userId: string,
    @Body() setRoleDto: SetRoleDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    this.userService.setUserRole(userId, setRoleDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN,UserRoleName.MANAGER))
  @Delete(USER_ROUTES.DELETE_USER)
  removeUser(@Param('id') id: string, @CurrentUser() user: User) {
    return this.userService.removeUser(id, user);
  }
}
