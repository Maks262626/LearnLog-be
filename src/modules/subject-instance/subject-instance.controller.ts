import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { CreateSubjectInstanceDto } from './dto/create-subject-instance.dto';
import { UpdateSubjectInstanceDto } from './dto/update-subject-instance.dto';
import { SubjectInstanceService } from './subject-instance.service';

@UseGuards(AuthGuard('jwt'))
@Controller('subject-instance')
@ApiBearerAuth('JWT-auth')
export class SubjectInstanceController {
  constructor(private readonly subjectInstanceService: SubjectInstanceService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Post()
  create(@Body() createSubjectInstanceDto: CreateSubjectInstanceDto) {
    return this.subjectInstanceService.create(createSubjectInstanceDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Get()
  findAll() {
    return this.subjectInstanceService.findAll();
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER))
  @Get('/teacher-schedule')
  getTeacherSchedule(
    @CurrentUser() user: User,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
  ) {
    const { id } = user;
    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);
    return this.subjectInstanceService.getTeachersSchedule(id, parsedStartDate, parsedEndDate);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.STUDENT))
  @Get('/in-my-group')
  getInMyGroup(
    @CurrentUser() user: User,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
  ) {
    const { group_id } = user;
    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);
    return this.subjectInstanceService.getByGroup(group_id, parsedStartDate, parsedEndDate);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER, UserRoleName.TEACHER))
  @Get('/by-subject-id/:id')
  findSubjectInstancesBySubjectId(@Param('id') id: string, @CurrentUser() user: User) {
    return this.subjectInstanceService.findSubjectInstancesBySubjectId(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Get('/by-group-id/:id')
  getByGroup(
    @Param('id') id: string,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @CurrentUser() user: User,
  ) {
    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);
    return this.subjectInstanceService.getByGroup(id, parsedStartDate, parsedEndDate, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectInstanceService.findOne(id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubjectInstanceDto: UpdateSubjectInstanceDto,
    @CurrentUser() user: User,
  ) {
    return this.subjectInstanceService.update(id, updateSubjectInstanceDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.MANAGER))
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.subjectInstanceService.remove(id, user);
  }
}
