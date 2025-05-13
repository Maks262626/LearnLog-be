import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { FacultyService } from './faculty.service';

@UseGuards(AuthGuard('jwt'))
@Controller('faculty')
@ApiBearerAuth('JWT-auth')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.facultyService.create(createFacultyDto);
  }

  @Get()
  findAll() {
    return this.facultyService.findAll();
  }

  @UseGuards(Role(UserRoleName.MANAGER))
  @Get('/get-faculties-in-my-uni')
  findFacultiesInMyUniversity(@CurrentUser() user: User) {
    return this.facultyService.getFacultiesByUniversityId(user.university_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facultyService.findOne(id);
  }

  @Get('/get-by-uni-id/:id')
  findFacultiesByUniversityId(@Param('id') id: string) {
    return this.facultyService.getFacultiesByUniversityId(id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacultyDto: UpdateFacultyDto) {
    return this.facultyService.update(id, updateFacultyDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facultyService.remove(id);
  }
}
