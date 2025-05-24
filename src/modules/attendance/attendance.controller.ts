import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { ATTENDANCE_CONTROLLER, ATTENDANCE_ROUTES } from './attendance,routes';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@UseGuards(AuthGuard('jwt'))
@Controller(ATTENDANCE_CONTROLLER)
@ApiBearerAuth('JWT-auth')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Post(ATTENDANCE_ROUTES.CREATE)
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get(ATTENDANCE_ROUTES.FIND_ALL)
  findAll() {
    return this.attendanceService.findAll();
  }

  @UseGuards(
    Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER, UserRoleName.TEACHER, UserRoleName.STUDENT),
  )
  @Get(ATTENDANCE_ROUTES.GET_BY_SUBJECT_INSTANCE_ID)
  getBySubjectInstanceId(@Param('id') id: string, @CurrentUser() user: User) {
    return this.attendanceService.getBySubjectInstanceId(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get(ATTENDANCE_ROUTES.FIND_ONE)
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER, UserRoleName.TEACHER))
  @Patch(ATTENDANCE_ROUTES.UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @CurrentUser() user: User,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Delete(ATTENDANCE_ROUTES.REMOVE)
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
