import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinalGradeService } from './final-grade.service';
import { CreateFinalGradeDto } from './dto/create-final-grade.dto';
import { UpdateFinalGradeDto } from './dto/update-final-grade.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('final-grade')
@ApiBearerAuth('JWT-auth')
export class FinalGradeController {
  constructor(private readonly finalGradeService: FinalGradeService) {}

  @Post()
  create(@Body() createFinalGradeDto: CreateFinalGradeDto) {
    return this.finalGradeService.create(createFinalGradeDto);
  }

  @Get()
  findAll() {
    return this.finalGradeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finalGradeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFinalGradeDto: UpdateFinalGradeDto) {
    return this.finalGradeService.update(id, updateFinalGradeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finalGradeService.remove(id);
  }
}
