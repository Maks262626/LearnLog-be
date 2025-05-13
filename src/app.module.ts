import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { AuthzModule } from './core/authz/authz.module';
import { DatabaseModule } from './core/database/database.module';
import { AssignmentModule } from './modules/assignment/assignment.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { FacultyModule } from './modules/faculty/faculty.module';
import { FinalGradeModule } from './modules/final-grade/final-grade.module';
import { GradeModule } from './modules/grade/grade.module';
import { GroupModule } from './modules/group/group.module';
import { ReportsModule } from './modules/reports/reports.module';
import { StudentSubmissionModule } from './modules/student-submission/student-submission.module';
import { SubjectInstanceModule } from './modules/subject-instance/subject-instance.module';
import { SubjectModule } from './modules/subject/subject.module';
import { UniversityModule } from './modules/university/university.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [() => config],
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthzModule,
    UniversityModule,
    FacultyModule,
    GroupModule,
    SubjectModule,
    FinalGradeModule,
    AssignmentModule,
    StudentSubmissionModule,
    GradeModule,
    SubjectInstanceModule,
    AttendanceModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
