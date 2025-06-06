import { forwardRef, Module } from '@nestjs/common';
import { AuthzModule } from 'src/core/authz/authz.module';
import { DatabaseModule } from 'src/core/database/database.module';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { assignmentProviders } from '../assignment/entities/assignment.entity';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { attendanceProviders } from '../attendance/entities/attendance.entity';
import { finalGradeProviders } from '../final-grade/entities/final-grade.entity';
import { FinalGradeRepository } from '../final-grade/final-grade.repository';
import { gradeProviders } from '../grade/entities/grade.entity';
import { GradeRepository } from '../grade/grade.repository';
import { groupProviders } from '../group/entities/group.entity';
import { GroupRepository } from '../group/group.repository';
import { studentSubmissionProviders } from '../student-submission/entities/student-submission.entity';
import { StudentSubmissionRepository } from '../student-submission/student-submission.repository';
import { subjectInstanceProviders } from '../subject-instance/entities/subject-instance.entity';
import { SubjectInstanceRepository } from '../subject-instance/subject-instance.repository';
import { subjectProviders } from '../subject/entities/subject.entity';
import { SubjectRepository } from '../subject/subject.repository';
import { userProviders } from './entities/user.entity';
import { UserPolicyService } from './user-policy.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthzModule)],
  controllers: [UserController],
  providers: [
    UserService,
    UserPolicyService,
    UserRepository,
    ...userProviders,
    GroupRepository,
    ...groupProviders,
    StudentSubmissionRepository,
    ...studentSubmissionProviders,
    AssignmentRepository,
    ...assignmentProviders,
    GradeRepository,
    ...gradeProviders,
    FinalGradeRepository,
    ...finalGradeProviders,
    SubjectInstanceRepository,
    ...subjectInstanceProviders,
    AttendanceRepository,
    ...attendanceProviders,
    SubjectRepository,
    ...subjectProviders,
  ],
  exports: [UserService, UserRepository, UserPolicyService],
})
export class UserModule {}
