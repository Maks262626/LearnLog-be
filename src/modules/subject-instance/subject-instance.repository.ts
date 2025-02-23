import { Inject, Injectable } from '@nestjs/common';
import { CreateSubjectInstanceDto } from './dto/create-subject-instance.dto';
import { UpdateSubjectInstanceDto } from './dto/update-subject-instance.dto';
import { SubjectInstance } from './entities/subject-instance.entity';

@Injectable()
export class SubjectInstanceRepository {
  constructor(
    @Inject('SUBJECT_INSTANCE_REPOSITORY')
    private subjectInstanceRepository: typeof SubjectInstance
  ){}

  async createSubjectInstance(createSubjectInstanceDto: CreateSubjectInstanceDto):Promise<SubjectInstance> {
    return await this.subjectInstanceRepository.create({...createSubjectInstanceDto})
  }

  async findAllSubjectInstances():Promise<SubjectInstance[]> {
    const subjectInstance = await this.subjectInstanceRepository.findAll();
    return subjectInstance;
  }

  async findSubjectInstance(id: string):Promise<SubjectInstance> {
    const subjectInstance = await this.subjectInstanceRepository.findByPk(id);
    return subjectInstance;
  }

  async updateSubjectInstance(id: string, updateSubjectInstanceDto: UpdateSubjectInstanceDto):Promise<boolean> {
    const subjectInstance = await this.subjectInstanceRepository.update(updateSubjectInstanceDto,{where:{id}});
    return Boolean(subjectInstance[0]);
  }

  async removeSubjectInstance(id: string):Promise<boolean> {
    const subjectInstance = await this.subjectInstanceRepository.destroy({where:{id}});
    return Boolean(subjectInstance[0]);
  }
}
