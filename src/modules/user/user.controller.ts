import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { CreateUserDto, SetRoleDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRoleName } from './entities/user.entity';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(@CurrentUser() user: User, @Body() createUserDto: CreateUserDto) {
    const { auth0_user_id } = user;
    return this.userService.register({ ...createUserDto, auth0_user_id });
  }

  @Get('/me')
  async userMe(@CurrentUser() user: User): Promise<Partial<User>> {
    const { auth0_user_id } = user;

    return this.userService.getMe(auth0_user_id);
  }

  @Get()
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @UseGuards(Role(UserRoleName.MANAGER))
  @Get('/teachers/:id')
  async getTeachersByFacultyId(@Param('id') id: string): Promise<User[]> {
    return this.userService.getTeachersByFacultyId(id);
  }

  @UseGuards(Role(UserRoleName.STUDENT))
  @Get('/in-my-group')
  findUsersInMyGroup(@CurrentUser() user: User): Promise<User[]> {
    const { group_id } = user;
    return this.userService.findUsersFromGroup(group_id, user);
  }

  @UseGuards(Role(UserRoleName.MANAGER))
  @Get(':id')
  findUser(@Param('id') id: string, @CurrentUser() user: User) {
    return this.userService.findUserWithPolicy(id, user);
  }

  @Get('university/:id')
  findUsersFromUniversity(@Param('id') id: string): Promise<User[]> {
    return this.userService.findUsersFromUniversity(id);
  }

  @Get('faculty/:id')
  findUsersFromFaculty(@Param('id') id: string): Promise<User[]> {
    return this.userService.findUsersFromFaculty(id);
  }

  @UseGuards(Role(UserRoleName.MANAGER))
  @Get('/in-my-faculty')
  findUsersFromMyFaculty(@CurrentUser() user: User): Promise<User[]> {
    const { faculty_id } = user;
    return this.userService.findUsersFromFaculty(faculty_id);
  }

  @UseGuards(Role(UserRoleName.MANAGER, UserRoleName.TEACHER))
  @Get('group/:id')
  findUsersFromGroup(@Param('id') id: string, @CurrentUser() user: User): Promise<User[]> {
    return this.userService.findUsersFromGroup(id, user);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Patch('/role/:id')
  @UseGuards(Role(UserRoleName.MANAGER))
  async setUserRole(
    @Param('id') userId: string,
    @Body() setRoleDto: SetRoleDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    this.userService.setUserRole(userId, setRoleDto, user);
  }

  @UseGuards(Role(UserRoleName.MANAGER))
  @Delete(':id')
  removeUser(@Param('id') id: string, @CurrentUser() user: User) {
    return this.userService.removeUser(id, user);
  }
}
