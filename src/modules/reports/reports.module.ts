import { forwardRef, Module } from '@nestjs/common';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { assignmentProviders } from '../assignment/entities/assignment.entity';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { attendanceProviders } from '../attendance/entities/attendance.entity';
import { finalGradeProviders } from '../final-grade/entities/final-grade.entity';
import { FinalGradeRepository } from '../final-grade/final-grade.repository';
import { gradeProviders } from '../grade/entities/grade.entity';
import { GradeRepository } from '../grade/grade.repository';
import { GroupModule } from '../group/group.module';
import { subjectInstanceProviders } from '../subject-instance/entities/subject-instance.entity';
import { SubjectInstanceRepository } from '../subject-instance/subject-instance.repository';
import { subjectProviders } from '../subject/entities/subject.entity';
import { SubjectRepository } from '../subject/subject.repository';
import { userProviders } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { ReportsController } from './reports.controller';
import { ReporstService } from './reports.service';

@Module({
  imports: [GroupModule, forwardRef(() => UserModule)],
  controllers: [ReportsController],
  providers: [
    ReporstService,
    SubjectRepository,
    ...subjectProviders,
    FinalGradeRepository,
    ...finalGradeProviders,
    AssignmentRepository,
    ...assignmentProviders,
    GradeRepository,
    ...gradeProviders,
    SubjectInstanceRepository,
    ...subjectInstanceProviders,
    AttendanceRepository,
    ...attendanceProviders,
    UserRepository,
    ...userProviders,
  ],
})
export class ReportsModule {}
