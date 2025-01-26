import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentSubmissionService } from './student-submission.service';
import { CreateStudentSubmissionDto } from './dto/create-student-submission.dto';
import { UpdateStudentSubmissionDto } from './dto/update-student-submission.dto';

@Controller('student-submission')
export class StudentSubmissionController {
  constructor(private readonly studentSubmissionService: StudentSubmissionService) {}

  @Post()
  create(@Body() createStudentSubmissionDto: CreateStudentSubmissionDto) {
    return this.studentSubmissionService.create(createStudentSubmissionDto);
  }

  @Get()
  findAll() {
    return this.studentSubmissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentSubmissionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentSubmissionDto: UpdateStudentSubmissionDto) {
    return this.studentSubmissionService.update(id, updateStudentSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentSubmissionService.remove(id);
  }
}
