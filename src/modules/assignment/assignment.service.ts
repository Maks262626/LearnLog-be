import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ErrorMap } from 'src/shared/response/error.map';
import { CreateGradeDto } from '../grade/dto/create-grade.dto';
import { GradeRepository } from '../grade/grade.repository';
import { SubjectRepository } from '../subject/subject.repository';
import { User } from '../user/entities/user.entity';
import { UserPolicyService } from '../user/user-policy.service';
import { UserRepository } from '../user/user.repository';
import { AssignmentRepository } from './assignment.repository';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentService {
  constructor(
    private readonly policy: UserPolicyService,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly subjectRepository: SubjectRepository,
    private readonly userRepository: UserRepository,
    private readonly gradeRepository: GradeRepository,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const transaction = await this.sequelize.transaction();
    try {
      const assignment = await this.assignmentRepository.createAssignment(
        createAssignmentDto,
        transaction,
      );

      const { subject_id } = assignment;
      const subject = await this.subjectRepository.findSubject(subject_id);
      const { group_id } = subject;

      const users = await this.userRepository.findUsersFromGroup(group_id);
      const gradeInstances: CreateGradeDto[] = [];
      users.forEach((user) => {
        const gradeDto: CreateGradeDto = {
          user_id: user.id,
          assignment_id: assignment.id,
          grade_value: null,
        };
        gradeInstances.push(gradeDto);
      });

      await this.gradeRepository.bulkCreate(gradeInstances, transaction);

      await transaction.commit();
      return assignment;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
  findAll(): Promise<Assignment[]> {
    return this.assignmentRepository.findAllAssignments();
  }

  findOne(id: string): Promise<Assignment> {
    return this.assignmentRepository.findAssignment(id);
  }

  getAssigmentsBySubjectId(subject_id: string, callerUser: User): Promise<Assignment[]> {
    if (!this.policy.isHasPermissionBySubjectId(subject_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.assignmentRepository.getAssigmentsBySubjectId(subject_id);
  }

  update(id: string, updateAssignmentDto: UpdateAssignmentDto): Promise<boolean> {
    return this.assignmentRepository.updateAssignment(id, updateAssignmentDto);
  }

  remove(id: string): Promise<boolean> {
    return this.assignmentRepository.removeAssignment(id);
  }
}
