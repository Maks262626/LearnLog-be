import { Injectable } from '@nestjs/common';
import { CreateSubjectScheduleDto } from './dto/create-subject-schedule.dto';
import { UpdateSubjectScheduleDto } from './dto/update-subject-schedule.dto';
import { SubjectScheduleRepository } from './subject-schedule.repository';
import { SubjectSchedule } from './entities/subject-schedule.entity';

@Injectable()
export class SubjectScheduleService {
  constructor(private readonly subjectScheduleRepository: SubjectScheduleRepository) { }

  create(createSubjectScheduleDto: CreateSubjectScheduleDto):Promise<SubjectSchedule> {
    return this.subjectScheduleRepository.createSubjectSchedule(createSubjectScheduleDto);
  }

  findAll():Promise<SubjectSchedule[]> {
    return this.subjectScheduleRepository.findAllSubjectSchedules();
  }

  findOne(id: string):Promise<SubjectSchedule> {
    return this.subjectScheduleRepository.findSubjectSchedule(id);
  }

  update(id: string, updateSubjectScheduleDto: UpdateSubjectScheduleDto):Promise<boolean> {
    return this.subjectScheduleRepository.updateSubjectSchedule(id,updateSubjectScheduleDto);
  }

  remove(id: string):Promise<boolean> {
    return this.subjectScheduleRepository.removeSubjectSchedule(id);
  }
}
