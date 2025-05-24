import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { CreateFinalGradeDto } from './dto/create-final-grade.dto';
import { UpdateFinalGradeDto } from './dto/update-final-grade.dto';
import { FINAL_GRADE_CONTROLLER, FINAL_GRADE_ROUTES } from './final-grade.routes';
import { FinalGradeService } from './final-grade.service';

@UseGuards(AuthGuard('jwt'))
@Controller(FINAL_GRADE_CONTROLLER)
@ApiBearerAuth('JWT-auth')
export class FinalGradeController {
  constructor(private readonly finalGradeService: FinalGradeService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Post(FINAL_GRADE_ROUTES.CREATE)
  create(@Body() createFinalGradeDto: CreateFinalGradeDto) {
    return this.finalGradeService.create(createFinalGradeDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get(FINAL_GRADE_ROUTES.FIND_ALL)
  findAll() {
    return this.finalGradeService.findAll();
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get(FINAL_GRADE_ROUTES.FIND_ONE)
  findOne(@Param('id') id: string) {
    return this.finalGradeService.findOne(id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER))
  @Patch(FINAL_GRADE_ROUTES.UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateFinalGradeDto: UpdateFinalGradeDto,
    @CurrentUser() user: User,
  ) {
    return this.finalGradeService.update(id, updateFinalGradeDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Delete(FINAL_GRADE_ROUTES.REMOVE)
  remove(@Param('id') id: string) {
    return this.finalGradeService.remove(id);
  }
}
