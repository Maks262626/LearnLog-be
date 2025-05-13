import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectService } from './subject.service';

@UseGuards(AuthGuard('jwt'))
@Controller('subject')
@ApiBearerAuth('JWT-auth')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get()
  findAll() {
    return this.subjectService.findAll();
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER))
  @Get('/teacher-subject')
  getTeacherSubjects(@CurrentUser() user: User) {
    const { id } = user;
    return this.subjectService.getSubjectsByTeacherId(id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Get('/in-my-faculty')
  getMyCourses(@CurrentUser() user: User) {
    const { faculty_id } = user;
    return this.subjectService.getMyCourses(faculty_id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.STUDENT))
  @Get('/in-my-group')
  getSubjectsInMyGroup(@CurrentUser() user: User) {
    const { group_id } = user;
    return this.subjectService.getSubjectsByGroupId(group_id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Get('/by-group-id/:id')
  getSubjectsByGroupId(@Param('id') id: string, @CurrentUser() user: User) {
    return this.subjectService.getSubjectsByGroupId(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER, UserRoleName.TEACHER))
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.subjectService.findOne(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
    @CurrentUser() user: User,
  ) {
    return this.subjectService.update(id, updateSubjectDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.subjectService.remove(id, user);
  }
}
