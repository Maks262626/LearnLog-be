import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { assignmentProviders } from '../assignment/entities/assignment.entity';
import { UserModule } from '../user/user.module';
import { studentSubmissionProviders } from './entities/student-submission.entity';
import { StudentSubmissionController } from './student-submission.controller';
import { StudentSubmissionRepository } from './student-submission.repository';
import { StudentSubmissionService } from './student-submission.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [StudentSubmissionController],
  providers: [
    StudentSubmissionService,
    StudentSubmissionRepository,
    ...studentSubmissionProviders,
    AssignmentRepository,
    ...assignmentProviders,
  ],
  exports: [StudentSubmissionService, StudentSubmissionRepository],
})
export class StudentSubmissionModule {}
