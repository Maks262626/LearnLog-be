import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { FacultyService } from './faculty.service';
import { FACULTY_CONTROLLER, FACULTY_ROUTES } from './faculty.routes';

@UseGuards(AuthGuard('jwt'))
@Controller(FACULTY_CONTROLLER)
@ApiBearerAuth('JWT-auth')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post(FACULTY_ROUTES.CREATE)
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.facultyService.create(createFacultyDto);
  }

  @Get(FACULTY_ROUTES.FIND_ALL)
  findAll() {
    return this.facultyService.findAll();
  }

  @UseGuards(Role(UserRoleName.MANAGER))
  @Get(FACULTY_ROUTES.FIND_FACULTIES_IN_MY_UNI)
  findFacultiesInMyUniversity(@CurrentUser() user: User) {
    return this.facultyService.getFacultiesByUniversityId(user.university_id);
  }

  @Get(FACULTY_ROUTES.FIND_ONE)
  findOne(@Param('id') id: string) {
    return this.facultyService.findOne(id);
  }

  @Get(FACULTY_ROUTES.FIND_BY_UNI_ID)
  findFacultiesByUniversityId(@Param('id') id: string) {
    return this.facultyService.getFacultiesByUniversityId(id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Patch(FACULTY_ROUTES.UPDATE)
  update(@Param('id') id: string, @Body() updateFacultyDto: UpdateFacultyDto) {
    return this.facultyService.update(id, updateFacultyDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Delete(FACULTY_ROUTES.REMOVE)
  remove(@Param('id') id: string) {
    return this.facultyService.remove(id);
  }
}
