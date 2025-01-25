import { Inject, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectRepository {
  constructor(
    @Inject('SUBJECT_REPOSITORY')
    private subjectRepository: typeof Subject
  ){}
  async createSubject(createSubjectDto: CreateSubjectDto):Promise<Subject> {
    return this.subjectRepository.create({...createSubjectDto});
  }

  async findAllSubjects():Promise<Subject[]> {
    const subjects = await this.subjectRepository.findAll();
    return subjects;
  }

  async findSubject(id: string):Promise<Subject> {
    const subject = await this.subjectRepository.findByPk(id);
    return subject;
  }

  async updateSubject(id: string, updateSubjectDto: UpdateSubjectDto):Promise<boolean> {
    const subject = await this.subjectRepository.update(updateSubjectDto,{where:{id}});
    return Boolean(subject[0]);
  }

  async removeSubject(id: string):Promise<boolean>{
    const subject = await this.subjectRepository.destroy({where:{id}});
    return Boolean(subject[0]);
  }
}
