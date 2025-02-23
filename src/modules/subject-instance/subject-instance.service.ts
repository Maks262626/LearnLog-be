import { Injectable } from '@nestjs/common';
import { CreateSubjectInstanceDto } from './dto/create-subject-instance.dto';
import { UpdateSubjectInstanceDto } from './dto/update-subject-instance.dto';
import { SubjectInstanceRepository } from './subject-instance.repository';
import { SubjectInstance } from './entities/subject-instance.entity';

@Injectable()
export class SubjectInstanceService {
  constructor(private readonly subjectInstanceRepository: SubjectInstanceRepository){}

  create(createSubjectInstanceDto: CreateSubjectInstanceDto):Promise<SubjectInstance> {
    return this.subjectInstanceRepository.createSubjectInstance(createSubjectInstanceDto);
  }

  findAll():Promise<SubjectInstance[]> {
    return this.subjectInstanceRepository.findAllSubjectInstances(); 
  }

  findOne(id: string):Promise<SubjectInstance> {
    return this.subjectInstanceRepository.findSubjectInstance(id); 
  }

  update(id: string, updateSubjectInstanceDto: UpdateSubjectInstanceDto):Promise<boolean> {
    return this.subjectInstanceRepository.updateSubjectInstance(id,updateSubjectInstanceDto); 
  }

  remove(id: string):Promise<boolean> {
    return this.subjectInstanceRepository.removeSubjectInstance(id); 
  }
}
