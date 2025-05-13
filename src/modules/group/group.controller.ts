import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupService } from './group.service';

@UseGuards(AuthGuard('jwt'))
@Controller('group')
@ApiBearerAuth('JWT-auth')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get('get-in-my-faculty')
  findGroupsInMyFaculty(@CurrentUser() user: User) {
    const { faculty_id } = user;
    return this.groupService.findGroupsByFacultyId(faculty_id);
  }

  @Get('get-by-faculty-id/:id')
  findGroupsByFacultyId(@Param('id') id: string) {
    return this.groupService.findGroupsByFacultyId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @CurrentUser() user: User,
  ) {
    return this.groupService.update(id, updateGroupDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.groupService.remove(id, user);
  }
}
