import { Inject, Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentRepository {
  constructor(
    @Inject('ASSIGNMENT_REPOSITORY')
    private assignmentRepository: typeof Assignment
  ){}

  async createAssignment(createAssignmentDto: CreateAssignmentDto):Promise<Assignment> {
    const assignment = await this.assignmentRepository.create({...createAssignmentDto});
    return assignment;
  }

  async findAllAssignments():Promise<Assignment[]> {
    const assignments = await this.assignmentRepository.findAll(); 
    return assignments;
  }

  async findAssignment(id: string):Promise<Assignment> {
    const assignment = await this.assignmentRepository.findByPk(id); 
    return assignment;
  }

  async updateAssignment(id: string, updateAssignmentDto: UpdateAssignmentDto):Promise<boolean> {
    const assignment = await this.assignmentRepository.update(updateAssignmentDto,{where:{id}}); 
    return Boolean(assignment[0]);
  }

  async removeAssignment(id: string):Promise<boolean> {
    const assignment = await this.assignmentRepository.destroy({where:{id}}); 
    return Boolean(assignment[0]);
  }
}
