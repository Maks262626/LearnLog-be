import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectRepository } from './subject.repository';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectService {
  constructor(private readonly subjectRepository: SubjectRepository) { }

  create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return this.subjectRepository.createSubject(createSubjectDto);
  }

  findAll(): Promise<Subject[]> {
    return this.subjectRepository.findAllSubjects();
  }

  findOne(id: string): Promise<Subject> {
    return this.subjectRepository.findSubject(id);
  }

  update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<boolean> {
    return this.subjectRepository.updateSubject(id, updateSubjectDto);
  }

  remove(id: string): Promise<boolean> {
    return this.subjectRepository.removeSubject(id);
  }
}
