import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectService } from './subject.service';
import { SUBJECT_CONTROLLER, SUBJECT_ROUTES } from './subject.routes';

@UseGuards(AuthGuard('jwt'))
@Controller(SUBJECT_CONTROLLER)
@ApiBearerAuth('JWT-auth')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Post(SUBJECT_ROUTES.CREATE)
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get(SUBJECT_ROUTES.FIND_ALL)
  findAll() {
    return this.subjectService.findAll();
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER))
  @Get(SUBJECT_ROUTES.GET_TEACHER_SUBJECTS)
  getTeacherSubjects(@CurrentUser() user: User) {
    const { id } = user;
    return this.subjectService.getSubjectsByTeacherId(id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Get(SUBJECT_ROUTES.GET_MY_COURSES)
  getMyCourses(@CurrentUser() user: User) {
    const { faculty_id } = user;
    return this.subjectService.getMyCourses(faculty_id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.STUDENT))
  @Get(SUBJECT_ROUTES.GET_SUBJECTS_IN_MY_GROUP)
  getSubjectsInMyGroup(@CurrentUser() user: User) {
    const { group_id } = user;
    return this.subjectService.getSubjectsByGroupId(group_id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Get(SUBJECT_ROUTES.GET_SUBJECTS_BY_GROUP_ID)
  getSubjectsByGroupId(@Param('id') id: string, @CurrentUser() user: User) {
    return this.subjectService.getSubjectsByGroupId(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER, UserRoleName.TEACHER))
  @Get(SUBJECT_ROUTES.FIND_ONE)
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.subjectService.findOne(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Patch(SUBJECT_ROUTES.UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
    @CurrentUser() user: User,
  ) {
    return this.subjectService.update(id, updateSubjectDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Delete(SUBJECT_ROUTES.DELETE)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.subjectService.remove(id, user);
  }
}
