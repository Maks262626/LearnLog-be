import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AssignmentRepository } from './assignment.repository';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentService {
  constructor(private readonly assignmentRepository: AssignmentRepository) { }

  create(createAssignmentDto: CreateAssignmentDto):Promise<Assignment> {
    return this.assignmentRepository.createAssignment(createAssignmentDto);
  }
  findAll():Promise<Assignment[]> {
    return this.assignmentRepository.findAllAssignments();
  }

  findOne(id: string):Promise<Assignment> {
    return this.assignmentRepository.findAssignment(id);
  }

  update(id: string, updateAssignmentDto: UpdateAssignmentDto):Promise<boolean> {
    return this.assignmentRepository.updateAssignment(id,updateAssignmentDto);
  }

  remove(id: string):Promise<boolean> {
    return this.assignmentRepository.removeAssignment(id);
  }
}
