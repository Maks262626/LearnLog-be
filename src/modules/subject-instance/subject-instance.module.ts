import { Module } from '@nestjs/common';
import { SubjectInstanceService } from './subject-instance.service';
import { SubjectInstanceController } from './subject-instance.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { SubjectInstanceRepository } from './subject-instance.repository';
import { subjectInstanceProviders } from './entities/subject-instance.entity';

@Module({
  imports: [DatabaseModule],
  controllers: [SubjectInstanceController],
  providers: [SubjectInstanceService,SubjectInstanceRepository,...subjectInstanceProviders],
})
export class SubjectInstanceModule {}
