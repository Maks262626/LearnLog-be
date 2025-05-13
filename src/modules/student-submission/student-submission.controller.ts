import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { CreateStudentSubmissionDto } from './dto/create-student-submission.dto';
import { UpdateStudentSubmissionDto } from './dto/update-student-submission.dto';
import { StudentSubmissionService } from './student-submission.service';
@UseGuards(AuthGuard('jwt'))
@Controller('student-submission')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
export class StudentSubmissionController {
  constructor(private readonly studentSubmissionService: StudentSubmissionService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.STUDENT))
  @Post()
  create(
    @Body() createStudentSubmissionDto: CreateStudentSubmissionDto,
    @CurrentUser() user: User,
  ) {
    createStudentSubmissionDto.user_id = user.id;
    return this.studentSubmissionService.create(createStudentSubmissionDto);
  }

  @Get()
  findAll() {
    return this.studentSubmissionService.findAll();
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER, UserRoleName.STUDENT))
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.studentSubmissionService.findOne(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER, UserRoleName.STUDENT))
  @Get('/by-subject-id/:id')
  findStudentSubmissionBySubjectId(@Param('id') id: string, @CurrentUser() user: User) {
    return this.studentSubmissionService.findStudentSubmissionBySubjectId(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudentSubmissionDto: UpdateStudentSubmissionDto,
    @CurrentUser() user: User,
  ) {
    return this.studentSubmissionService.update(id, updateStudentSubmissionDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentSubmissionService.remove(id);
  }
}
