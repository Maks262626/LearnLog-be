import { forwardRef, Module } from '@nestjs/common';
import { AuthzModule } from 'src/core/authz/authz.module';
import { DatabaseModule } from 'src/core/database/database.module';
import { finalGradeProviders } from '../final-grade/entities/final-grade.entity';
import { FinalGradeRepository } from '../final-grade/final-grade.repository';
import { groupProviders } from '../group/entities/group.entity';
import { GroupRepository } from '../group/group.repository';
import { userProviders } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { subjectProviders } from './entities/subject.entity';
import { SubjectController } from './subject.controller';
import { SubjectRepository } from './subject.repository';
import { SubjectService } from './subject.service';

@Module({
  imports: [DatabaseModule, AuthzModule, forwardRef(() => UserModule)],
  controllers: [SubjectController],
  providers: [
    SubjectService,
    SubjectRepository,
    ...subjectProviders,
    GroupRepository,
    ...groupProviders,
    FinalGradeRepository,
    ...finalGradeProviders,
    UserRepository,
    ...userProviders,
  ],
})
export class SubjectModule {}
