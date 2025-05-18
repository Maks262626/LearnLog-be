import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ASSIGNMENT_CONTROLLER, ASSIGNMENT_ROUTES } from './assignment.routes';

@UseGuards(AuthGuard('jwt'))
@Controller(ASSIGNMENT_CONTROLLER)
@ApiBearerAuth('JWT-auth')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER))
  @Post(ASSIGNMENT_ROUTES.CREATE)
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentService.create(createAssignmentDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get(ASSIGNMENT_ROUTES.FIND_ALL)
  findAll() {
    return this.assignmentService.findAll();
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER, UserRoleName.STUDENT))
  @Get(ASSIGNMENT_ROUTES.FIND_BY_SUBJECT_ID)
  findBySubjectId(@Param('id') id: string, @CurrentUser() user: User) {
    return this.assignmentService.getAssigmentsBySubjectId(id, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER, UserRoleName.STUDENT))
  @Get(ASSIGNMENT_ROUTES.FIND_ONE)
  findOne(@Param('id') id: string,@CurrentUser() user: User) {
    return this.assignmentService.findOne(id,user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER))
  @Patch(ASSIGNMENT_ROUTES.UPDATE)
  update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    return this.assignmentService.update(id, updateAssignmentDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER))
  @Delete(ASSIGNMENT_ROUTES.REMOVE)
  remove(@Param('id') id: string) {
    return this.assignmentService.remove(id);
  }
}
