import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupService } from './group.service';
import { GROUP_CONTROLLER, GROUP_ROUTES } from './group.routes';

@UseGuards(AuthGuard('jwt'))
@Controller(GROUP_CONTROLLER)
@ApiBearerAuth('JWT-auth')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Post(GROUP_ROUTES.CREATE)
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get(GROUP_ROUTES.FIND_ALL)
  findAll() {
    return this.groupService.findAll();
  }

  @Get(GROUP_ROUTES.FIND_IN_MY_FACULTY)
  findGroupsInMyFaculty(@CurrentUser() user: User) {
    const { faculty_id } = user;
    return this.groupService.findGroupsByFacultyId(faculty_id);
  }

  @Get(GROUP_ROUTES.FIND_BY_FACULTY_ID)
  findGroupsByFacultyId(@Param('id') id: string) {
    return this.groupService.findGroupsByFacultyId(id);
  }

  @Get(GROUP_ROUTES.FIND_ONE)
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Patch(GROUP_ROUTES.UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @CurrentUser() user: User,
  ) {
    return this.groupService.update(id, updateGroupDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Delete(GROUP_ROUTES.REMOVE)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.groupService.remove(id, user);
  }
}
