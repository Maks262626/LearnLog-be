import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ErrorMap } from 'src/shared/response/error.map';
import { CreateFinalGradeDto } from '../final-grade/dto/create-final-grade.dto';
import { FinalGradeRepository } from '../final-grade/final-grade.repository';
import { GroupRepository } from '../group/group.repository';
import { User } from '../user/entities/user.entity';
import { UserPolicyService } from '../user/user-policy.service';
import { UserRepository } from '../user/user.repository';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';
import { SubjectRepository } from './subject.repository';

@Injectable()
export class SubjectService {
  constructor(
    private readonly policy: UserPolicyService,
    private readonly subjectRepository: SubjectRepository,
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly finalGradeRepository: FinalGradeRepository,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const transaction = await this.sequelize.transaction();
    try {
      const subject = await this.subjectRepository.createSubject(createSubjectDto, transaction);
      const { group_id } = subject;
      const users = await this.userRepository.findUsersFromGroup(group_id);
      const finalGradeInstances: CreateFinalGradeDto[] = [];
      users.forEach((user) => {
        const finalGradeDto: CreateFinalGradeDto = {
          user_id: user.id,
          subject_id: subject.id,
          final_grade: null,
        };
        finalGradeInstances.push(finalGradeDto);
      });
      await this.finalGradeRepository.bulkCreate(finalGradeInstances, transaction);
      await transaction.commit();
      return subject;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  findAll(): Promise<Subject[]> {
    return this.subjectRepository.findAllSubjects();
  }
  async getMyCourses(faculty_id: string): Promise<Subject[]> {
    const groups = await this.groupRepository.findGroupsByFacultyId(faculty_id);
    const groupsIds = groups.map((group) => group.id);

    return this.subjectRepository.getMyCourses(groupsIds);
  }

  getSubjectsByGroupId(group_id: string, callerUser?: User): Promise<Subject[]> {
    if (callerUser && !this.policy.isManagerHasPermissionByGroupId(group_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.subjectRepository.getSubjectsByGroupId(group_id);
  }

  getSubjectsByTeacherId(teacher_id: string): Promise<Subject[]> {
    return this.subjectRepository.getSubjectsByTeacherId(teacher_id);
  }

  findOne(subject_id: string, callerUser: User): Promise<Subject> {
    if (!this.policy.isHasPermissionBySubjectId(subject_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.subjectRepository.findSubject(subject_id);
  }

  update(
    subject_id: string,
    updateSubjectDto: UpdateSubjectDto,
    callerUser: User,
  ): Promise<boolean> {
    if (!this.policy.isHasPermissionBySubjectId(subject_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.subjectRepository.updateSubject(subject_id, updateSubjectDto);
  }

  remove(subject_id: string, callerUser: User): Promise<boolean> {
    if (!this.policy.isHasPermissionBySubjectId(subject_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.subjectRepository.removeSubject(subject_id);
  }
}
