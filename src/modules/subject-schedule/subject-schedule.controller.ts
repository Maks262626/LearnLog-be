import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubjectScheduleService } from './subject-schedule.service';
import { CreateSubjectScheduleDto } from './dto/create-subject-schedule.dto';
import { UpdateSubjectScheduleDto } from './dto/update-subject-schedule.dto';

@Controller('subject-schedule')
export class SubjectScheduleController {
  constructor(private readonly subjectScheduleService: SubjectScheduleService) {}

  @Post()
  create(@Body() createSubjectScheduleDto: CreateSubjectScheduleDto) {
    return this.subjectScheduleService.create(createSubjectScheduleDto);
  }

  @Get()
  findAll() {
    return this.subjectScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectScheduleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectScheduleDto: UpdateSubjectScheduleDto) {
    return this.subjectScheduleService.update(id, updateSubjectScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectScheduleService.remove(id);
  }
}
