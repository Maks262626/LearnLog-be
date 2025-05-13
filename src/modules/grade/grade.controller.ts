import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { GradeService } from './grade.service';

@UseGuards(AuthGuard('jwt'))
@Controller('grade')
@ApiBearerAuth('JWT-auth')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Post()
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradeService.create(createGradeDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get()
  findAll() {
    return this.gradeService.findAll();
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER, UserRoleName.STUDENT))
  @Get('/by-user-assignment-id/:userId/:assignmentId')
  getGradeByUserIdAndAssignmentId(
    @Param('userId') userId: string,
    @Param('assignmentId') assignmentId: string,
    @CurrentUser() user: User,
  ) {
    return this.gradeService.getGradeByUserIdAndAssignmentId(userId, assignmentId, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER, UserRoleName.STUDENT))
  @Get('/by-assignment-id/:id')
  getGradesByAssignmentId(@Param('id') id: string, @CurrentUser() user: User) {
    return this.gradeService.getGradesByAssignmentId(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER, UserRoleName.STUDENT))
  @Get(':id')
  findOne(@Param('id') id: string, user: User) {
    return this.gradeService.findOne(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
    @CurrentUser() user: User,
  ) {
    return this.gradeService.update(id, updateGradeDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradeService.remove(id);
  }
}
