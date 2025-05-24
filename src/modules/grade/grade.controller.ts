import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GRADE_CONTROLLER, GRADE_ROUTES } from './grade.routes';
import { GradeService } from './grade.service';

@UseGuards(AuthGuard('jwt'))
@Controller(GRADE_CONTROLLER)
@ApiBearerAuth('JWT-auth')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Post(GRADE_ROUTES.CREATE)
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradeService.create(createGradeDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get(GRADE_ROUTES.FIND_ALL)
  findAll() {
    return this.gradeService.findAll();
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER, UserRoleName.STUDENT))
  @Get(GRADE_ROUTES.FIND_BY_USER_ASSIGNMENT)
  getGradeByUserIdAndAssignmentId(
    @Param('userId') userId: string,
    @Param('assignmentId') assignmentId: string,
    @CurrentUser() user: User,
  ) {
    return this.gradeService.getGradeByUserIdAndAssignmentId(userId, assignmentId, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER, UserRoleName.STUDENT))
  @Get(GRADE_ROUTES.FIND_BY_ASSIGNMENT)
  getGradesByAssignmentId(@Param('id') id: string, @CurrentUser() user: User) {
    return this.gradeService.getGradesByAssignmentId(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER, UserRoleName.STUDENT))
  @Get(GRADE_ROUTES.FIND_ONE)
  findOne(@Param('id') id: string, user: User) {
    return this.gradeService.findOne(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER))
  @Patch(GRADE_ROUTES.UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
    @CurrentUser() user: User,
  ) {
    return this.gradeService.update(id, updateGradeDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Delete(GRADE_ROUTES.REMOVE)
  remove(@Param('id') id: string) {
    return this.gradeService.remove(id);
  }
}
