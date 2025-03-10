import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Role } from 'src/core/authz/role.guard';
import { UserRoleName } from '../user/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(Role(UserRoleName.SUPERADMIN))
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facultyService.findOne(id);
  }

  @Get('/get-by-uni-id/:id')
  findFacultiesByUniversityId(@Param('id') id: string) {
    return this.facultyService.getFacultiesByUniversityId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacultyDto: UpdateFacultyDto) {
    return this.facultyService.update(id, updateFacultyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facultyService.remove(id);
  }
}
