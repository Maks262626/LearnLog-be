import { ForbiddenException, Injectable } from '@nestjs/common';
import { ErrorMap } from 'src/shared/response/error.map';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { User } from '../user/entities/user.entity';
import { UserPolicyService } from '../user/user-policy.service';
import { CreateStudentSubmissionDto } from './dto/create-student-submission.dto';
import { UpdateStudentSubmissionDto } from './dto/update-student-submission.dto';
import { StudentSubmission } from './entities/student-submission.entity';
import { StudentSubmissionRepository } from './student-submission.repository';

@Injectable()
export class StudentSubmissionService {
  constructor(
    private readonly policy: UserPolicyService,
    private readonly studentSubmissionRepository: StudentSubmissionRepository,
    private readonly assignmentRepository: AssignmentRepository,
  ) {}

  create(createStudentSubmissionDto: CreateStudentSubmissionDto): Promise<StudentSubmission> {
    return this.studentSubmissionRepository.createStudentSubmission(createStudentSubmissionDto);
  }

  findAll(): Promise<StudentSubmission[]> {
    return this.studentSubmissionRepository.findAllStudentSubmissions();
  }

  findOne(student_submission_id: string, callerUser: User): Promise<StudentSubmission> {
    if (!this.policy.isHasPermissionBySubmissionId(student_submission_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.studentSubmissionRepository.findStudentSubmission(student_submission_id);
  }

  async findStudentSubmissionBySubjectId(
    subject_id: string,
    callerUser: User,
  ): Promise<StudentSubmission[]> {
    if (!this.policy.isHasPermissionBySubjectId(subject_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    const assignments = await this.assignmentRepository.getAssigmentsBySubjectId(subject_id);
    const assignmentIds = assignments.map((a) => a.id);
    const studentSubmissions =
      await this.studentSubmissionRepository.findStudentSubmissionByAssignmentIds(assignmentIds);
    return studentSubmissions;
  }

  update(
    student_submission_id: string,
    updateStudentSubmissionDto: UpdateStudentSubmissionDto,
    callerUser: User,
  ): Promise<boolean> {
    if (!this.policy.isHasPermissionBySubmissionId(student_submission_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.studentSubmissionRepository.updateStudentSubmission(
      student_submission_id,
      updateStudentSubmissionDto,
    );
  }

  remove(id: string): Promise<boolean> {
    return this.studentSubmissionRepository.removeStudentSubmission(id);
  }
}
