import { Module } from '@nestjs/common';
import { StudentSubmissionService } from './student-submission.service';
import { StudentSubmissionController } from './student-submission.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { StudentSubmissionRepository } from './student-submission.repository';
import { studentSubmissionProviders } from './entities/student-submission.entity';

@Module({
  imports: [DatabaseModule],
  controllers: [StudentSubmissionController],
  providers: [StudentSubmissionService,StudentSubmissionRepository,...studentSubmissionProviders],
})
export class StudentSubmissionModule {}
