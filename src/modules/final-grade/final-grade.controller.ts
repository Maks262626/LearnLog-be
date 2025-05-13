import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/guards/role.guard';
import { User, UserRoleName } from '../user/entities/user.entity';
import { CreateFinalGradeDto } from './dto/create-final-grade.dto';
import { UpdateFinalGradeDto } from './dto/update-final-grade.dto';
import { FinalGradeService } from './final-grade.service';

@UseGuards(AuthGuard('jwt'))
@Controller('final-grade')
@ApiBearerAuth('JWT-auth')
export class FinalGradeController {
  constructor(private readonly finalGradeService: FinalGradeService) {}

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Post()
  create(@Body() createFinalGradeDto: CreateFinalGradeDto) {
    return this.finalGradeService.create(createFinalGradeDto);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get()
  findAll() {
    return this.finalGradeService.findAll();
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finalGradeService.findOne(id);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN, UserRoleName.TEACHER))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFinalGradeDto: UpdateFinalGradeDto,
    @CurrentUser() user: User,
  ) {
    return this.finalGradeService.update(id, updateFinalGradeDto, user);
  }

  @UseGuards(Role(UserRoleName.SUPERADMIN))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finalGradeService.remove(id);
  }
}
