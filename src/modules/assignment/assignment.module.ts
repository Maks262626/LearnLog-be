import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { gradeProviders } from '../grade/entities/grade.entity';
import { GradeRepository } from '../grade/grade.repository';
import { subjectProviders } from '../subject/entities/subject.entity';
import { SubjectRepository } from '../subject/subject.repository';
import { userProviders } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { AssignmentController } from './assignment.controller';
import { AssignmentRepository } from './assignment.repository';
import { AssignmentService } from './assignment.service';
import { assignmentProviders } from './entities/assignment.entity';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule)],
  controllers: [AssignmentController],
  providers: [
    AssignmentService,
    AssignmentRepository,
    ...assignmentProviders,
    SubjectRepository,
    ...subjectProviders,
    UserRepository,
    ...userProviders,
    GradeRepository,
    ...gradeProviders,
  ],
})
export class AssignmentModule {}
