import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { CreateStudentSubmissionDto } from './dto/create-student-submission.dto';
import { UpdateStudentSubmissionDto } from './dto/update-student-submission.dto';
import {
  STUDENT_SUBMISSION_CONTROLLER,
  STUDENT_SUBMISSION_ROUTES,
} from './student-submission.routes';
import { StudentSubmissionService } from './student-submission.service';
@UseGuards(AuthGuard('jwt'))
@Controller(STUDENT_SUBMISSION_CONTROLLER)
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
export class StudentSubmissionController {
  constructor(private readonly studentSubmissionService: StudentSubmissionService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.STUDENT))
  @Post(STUDENT_SUBMISSION_ROUTES.CREATE)
  create(
    @Body() createStudentSubmissionDto: CreateStudentSubmissionDto,
    @CurrentUser() user: User,
  ) {
    createStudentSubmissionDto.user_id = user.id;
    return this.studentSubmissionService.create(createStudentSubmissionDto);
  }

  @Get(STUDENT_SUBMISSION_ROUTES.FIND_ALL)
  findAll() {
    return this.studentSubmissionService.findAll();
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER, UserRoleName.STUDENT))
  @Get(STUDENT_SUBMISSION_ROUTES.FIND_ONE)
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.studentSubmissionService.findOne(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER, UserRoleName.STUDENT))
  @Get(STUDENT_SUBMISSION_ROUTES.FIND_BY_SUBJECT_ID)
  findStudentSubmissionBySubjectId(@Param('id') id: string, @CurrentUser() user: User) {
    return this.studentSubmissionService.findStudentSubmissionBySubjectId(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER))
  @Patch(STUDENT_SUBMISSION_ROUTES.UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateStudentSubmissionDto: UpdateStudentSubmissionDto,
    @CurrentUser() user: User,
  ) {
    return this.studentSubmissionService.update(id, updateStudentSubmissionDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Delete(STUDENT_SUBMISSION_ROUTES.DELETE)
  remove(@Param('id') id: string) {
    return this.studentSubmissionService.remove(id);
  }
}
