import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('attendance')
@ApiBearerAuth('JWT-auth')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @UseGuards(
    Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER, UserRoleName.TEACHER, UserRoleName.STUDENT),
  )
  @Get('/subject-instance/:id')
  getBySubjectInstanceId(@Param('id') id: string, @CurrentUser() user: User) {
    return this.attendanceService.getBySubjectInstanceId(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER, UserRoleName.TEACHER))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @CurrentUser() user: User,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
