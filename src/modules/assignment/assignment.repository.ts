import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Grade } from '../grade/entities/grade.entity';
import { User } from '../user/entities/user.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentRepository {
  constructor(
    @Inject('ASSIGNMENT_REPOSITORY')
    private assignmentRepository: typeof Assignment,
  ) {}

  async createAssignment(
    createAssignmentDto: CreateAssignmentDto,
    transaction?: Transaction,
  ): Promise<Assignment> {
    const assignment = await this.assignmentRepository.create(
      { ...createAssignmentDto },
      { transaction },
    );
    return assignment;
  }

  async findAllAssignments(): Promise<Assignment[]> {
    const assignments = await this.assignmentRepository.findAll({
      include: [{ model: Grade, attributes: ['id', 'grade_value'] }],
    });
    return assignments;
  }

  async findAssignment(id: string): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findByPk(id, {
      include: [
        {
          model: Grade,
          include: [{ model: User, attributes: ['id', 'first_name', 'last_name'] }],
        },
      ],
    });
    return assignment;
  }

  async getAssigmentsBySubjectId(
    subject_id: string,
    withInclude: boolean = true,
  ): Promise<Assignment[]> {
    const assignments = await this.assignmentRepository.findAll({
      where: { subject_id },
      include: withInclude
        ? [
            {
              model: Grade,
              include: [{ model: User, attributes: ['id', 'first_name', 'last_name'] }],
            },
          ]
        : [],
    });
    return assignments;
  }

  async updateAssignment(id: string, updateAssignmentDto: UpdateAssignmentDto): Promise<boolean> {
    const assignment = await this.assignmentRepository.update(updateAssignmentDto, {
      where: { id },
    });
    return Boolean(assignment[0]);
  }

  async removeAssignment(id: string): Promise<boolean> {
    const assignment = await this.assignmentRepository.destroy({
      where: { id },
    });
    return Boolean(assignment[0]);
  }
}
