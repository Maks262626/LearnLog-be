import { Module } from '@nestjs/common';
import { SubjectScheduleService } from './subject-schedule.service';
import { SubjectScheduleController } from './subject-schedule.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { SubjectScheduleRepository } from './subject-schedule.repository';
import { subjectScheduleProviders } from './entities/subject-schedule.entity';

@Module({
  imports: [DatabaseModule],
  controllers: [SubjectScheduleController],
  providers: [SubjectScheduleService, SubjectScheduleRepository, ...subjectScheduleProviders],
})
export class SubjectScheduleModule { }
