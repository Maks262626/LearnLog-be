import { Injectable } from '@nestjs/common';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { FinalGradeRepository } from '../final-grade/final-grade.repository';
import { GradeRepository } from '../grade/grade.repository';
import { GroupRepository } from '../group/group.repository';
import { StudentSubmissionRepository } from '../student-submission/student-submission.repository';
import { SubjectInstanceRepository } from '../subject-instance/subject-instance.repository';
import { SubjectRepository } from '../subject/subject.repository';
import { User, UserRoleName } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserPolicyService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
    private readonly subjectRepository: SubjectRepository,
    private readonly studentSubmissionRepository: StudentSubmissionRepository,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly gradeRepository: GradeRepository,
    private readonly finalGradeRepository: FinalGradeRepository,
    private readonly subjectInstanceRepository: SubjectInstanceRepository,
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

  async canAssignRole(
    caller: UserRoleName,
    target: UserRoleName,
    userId: string,
    callerUser: User,
  ): Promise<boolean> {
    if (caller === UserRoleName.SUPERADMIN) return true;
    if (caller === UserRoleName.MANAGER) {
      return [UserRoleName.TEACHER, UserRoleName.STUDENT].includes(target);
    }
    const user = await this.userRepository.findUser(userId);
    if (!user) return false;
    if (user.faculty_id === callerUser.faculty_id) return true;
    return false;
  }

  async isManagerHasPermission(userId: string, callerUser: User): Promise<boolean> {
    if (callerUser.role === UserRoleName.SUPERADMIN) return true;
    if (callerUser.role !== UserRoleName.MANAGER) return false;
    const user = await this.userRepository.findUser(userId);
    if (!user) return false;
    if (user.faculty_id === callerUser.faculty_id) return true;
    return false;
  }

  async isManagerHasPermissionByFacultyId(faculty_id: string, callerUser: User) {
    if (callerUser.role === UserRoleName.SUPERADMIN) return true;
    if (callerUser.faculty_id === faculty_id) return true;
    return false;
  }

  async isManagerHasPermissionByGroupId(group_id: string, callerUser: User): Promise<boolean> {
    if (callerUser.role === UserRoleName.SUPERADMIN) return true;
    const { faculty_id } = callerUser;
    const group = await this.groupRepository.findGroup(group_id);
    if (!group) return false;
    if (group.faculty_id === faculty_id) return true;
    return false;
  }

  async isHasPermissionBySubjectId(subject_id: string, callerUser: User) {
    if (callerUser.role === UserRoleName.SUPERADMIN) return true;
    const subject = await this.subjectRepository.findSubject(subject_id);
    if (!subject) return false;

    const group = await this.groupRepository.findGroup(subject.group_id);
    if (group.faculty_id === callerUser.faculty_id) return true;
    return false;
  }

  async isHasPermissionBySubmissionId(student_submission_id: string, callerUser: User) {
    if (callerUser.role === UserRoleName.SUPERADMIN) return true;
    const submission =
      await this.studentSubmissionRepository.findStudentSubmission(student_submission_id);
    if (!submission) return false;
    const assignment = await this.assignmentRepository.findAssignment(submission.assignment_id);
    const subject = await this.subjectRepository.findSubject(assignment.subject_id);
    const group = await this.groupRepository.findGroup(subject.group_id);
    if (callerUser.role === UserRoleName.TEACHER && callerUser.faculty_id === group.faculty_id)
      return true;
    if (callerUser.role === UserRoleName.STUDENT && callerUser.group_id === group.id) return true;
    return false;
  }

  async isHasPermissionByGradeId(grade_id: string, callerUser: User) {
    if (callerUser.role === UserRoleName.SUPERADMIN) return true;
    const grade = await this.gradeRepository.findGrade(grade_id);
    if (!grade) return false;
    const assignment = await this.assignmentRepository.findAssignment(grade.assignment_id);
    const subject = await this.subjectRepository.findSubject(assignment.subject_id);
    if (subject.teacher_id === callerUser.id) return true;
    return false;
  }

  async isHasPermissionByFinalGradeId(final_grade_id: string, callerUser: User) {
    if (callerUser.role === UserRoleName.SUPERADMIN) return true;
    const finalGrade = await this.finalGradeRepository.findFinalGrade(final_grade_id);
    if (!finalGrade) return false;
    const subject = await this.subjectRepository.findSubject(finalGrade.subject_id);
    if (subject.teacher_id === callerUser.id) return true;
    return false;
  }

  async isHasPermissionBySubjectInstanceId(subject_instance_id: string, callerUser: User) {
    if (callerUser.role === UserRoleName.SUPERADMIN) return true;
    const subjectInstance =
      await this.subjectInstanceRepository.findSubjectInstance(subject_instance_id);
    if (!subjectInstance) return false;
    const subject = await this.subjectRepository.findSubject(subjectInstance.subject_id);
    const group = await this.groupRepository.findGroup(subject.group_id);
    if (callerUser.role === UserRoleName.MANAGER && callerUser.faculty_id === group.faculty_id)
      return true;
    if (callerUser.role === UserRoleName.TEACHER && callerUser.id === subject.teacher_id)
      return true;
    if (callerUser.role === UserRoleName.STUDENT && callerUser.group_id === group.id) return true;
    return false;
  }

  async isHasPermissionByAttendanceId(attendance_id: string, callerUser: User) {
    if (callerUser.role === UserRoleName.SUPERADMIN) return true;
    const attendance = await this.attendanceRepository.findOneAttendance(attendance_id);
    if (!attendance) return false;
    const subjectInstance = await this.subjectInstanceRepository.findSubjectInstance(
      attendance.subject_instance_id,
    );
    const subject = await this.subjectRepository.findSubject(subjectInstance.subject_id);
    const group = await this.groupRepository.findGroup(subject.group_id);
    if (callerUser.role === UserRoleName.MANAGER && callerUser.faculty_id === group.faculty_id)
      return true;
    if (callerUser.role === UserRoleName.TEACHER && callerUser.id === subject.teacher_id)
      return true;
    return false;
  }

  async isHasPermissionByAssignmentId(assignment_id: string, callerUser: User) {
    if (callerUser.role === UserRoleName.SUPERADMIN) return true;
    const assignment = await this.assignmentRepository.findAssignment(assignment_id);
    if (assignment) return false;
    const subject = await this.subjectRepository.findSubject(assignment.subject_id);
    const group = await this.groupRepository.findGroup(subject.group_id);
    if (callerUser.role === UserRoleName.TEACHER && callerUser.faculty_id === group.faculty_id)
      return true;
    if (callerUser.role === UserRoleName.STUDENT && callerUser.group_id === group.id) return true;
    return false;
  }
}
