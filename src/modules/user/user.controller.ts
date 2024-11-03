import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/core/authz/authz-role.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UserRole } from 'src/shared/decorators/user-role.decorator';
import { CreateUserDto, SetRoleDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRoleName } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthzService } from 'src/core/authz/authz.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @UseGuards(AuthGuard('jwt'))
  async registerUser(
    @CurrentUser() user: User,
    @Body() createUserDto: CreateUserDto,
  ) {
    const { auth0_user_id } = user;
    return this.userService.register({ ...createUserDto, auth0_user_id });
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser({ ...createUserDto });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async userMe(@CurrentUser() user: User): Promise<Partial<User>> {
    const { auth0_user_id } = user;
    return this.userService.getUserMe(auth0_user_id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async findAllUsers(@UserRole() role: string): Promise<User[]> {
    return this.userService.findAllUsers(role);
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.userService.findUser(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Patch('/role/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async setUserRole(
    @Param('id') userId: string,
    @Body() setRoleDto: SetRoleDto,
    @UserRole() role: UserRoleName,
  ): Promise<void> {
    this.userService.setUserRole(userId, setRoleDto, role);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }
}
