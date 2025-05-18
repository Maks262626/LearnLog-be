import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/shared/guards/role.guard';
import { UserRoleName } from '../user/entities/user.entity';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { UniversityService } from './university.service';
import { UNIVERSITY_CONTROLLER, UNIVERSITY_ROUTES } from './university.routes';

@UseGuards(AuthGuard('jwt'))
@Controller(UNIVERSITY_CONTROLLER)
@ApiBearerAuth('JWT-auth')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Post(UNIVERSITY_ROUTES.CREATE)
  createUniversity(@Body() createUniversityDto: CreateUniversityDto) {
    return this.universityService.createUniversity(createUniversityDto);
  }

  @Get(UNIVERSITY_ROUTES.FIND_ALL)
  findAllUniversities() {
    return this.universityService.findAllUniversities();
  }

  @Get(UNIVERSITY_ROUTES.FIND_ONE)
  findUniversity(@Param('id') id: string) {
    return this.universityService.findUniversity(id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Patch(UNIVERSITY_ROUTES.UPDATE)
  updateUniversity(@Param('id') id: string, @Body() updateUniversityDto: UpdateUniversityDto) {
    return this.universityService.updateUniversity(id, updateUniversityDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Delete(UNIVERSITY_ROUTES.DELETE)
  removeUniversity(@Param('id') id: string) {
    return this.universityService.removeUniversity(id);
  }
}
