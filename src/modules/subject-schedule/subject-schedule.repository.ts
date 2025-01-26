import { Inject, Injectable } from '@nestjs/common';
import { CreateSubjectScheduleDto } from './dto/create-subject-schedule.dto';
import { UpdateSubjectScheduleDto } from './dto/update-subject-schedule.dto';
import { SubjectSchedule } from './entities/subject-schedule.entity';

@Injectable()
export class SubjectScheduleRepository {
  constructor(
    @Inject('SUBJECT_SCHEDULE_REPOSITORY')
    private subjectScheduleRepository: typeof SubjectSchedule
  ){}

  async createSubjectSchedule(createSubjectScheduleDto: CreateSubjectScheduleDto):Promise<SubjectSchedule> {
    return await this.subjectScheduleRepository.create({...createSubjectScheduleDto});
  }

  async findAllSubjectSchedules():Promise<SubjectSchedule[]> {
    const subjectSchedules = await this.subjectScheduleRepository.findAll();
    return subjectSchedules;
  }

  async findSubjectSchedule(id: string):Promise<SubjectSchedule> {
    const subjectSchedule = await this.subjectScheduleRepository.findByPk(id);
    return subjectSchedule;
  }

  async updateSubjectSchedule(id: string, updateSubjectScheduleDto: UpdateSubjectScheduleDto):Promise<boolean> {
    const subjectSchedule = await this.subjectScheduleRepository.update(updateSubjectScheduleDto,{where:{id}});
    return Boolean(subjectSchedule[0]);
  }

  async removeSubjectSchedule(id: string):Promise<boolean> {
    const subjectSchedule = await this.subjectScheduleRepository.destroy({where:{id}});
    return Boolean(subjectSchedule[0]);
  }
}
