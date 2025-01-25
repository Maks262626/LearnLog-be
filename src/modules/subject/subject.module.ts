import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { AuthzModule } from 'src/core/authz/authz.module';
import { SubjectRepository } from './subject.repository';
import { subjectProviders } from './entities/subject.entity';

@Module({
  imports: [DatabaseModule,AuthzModule],
  controllers: [SubjectController],
  providers: [SubjectService, SubjectRepository, ...subjectProviders],
})
export class SubjectModule {}
