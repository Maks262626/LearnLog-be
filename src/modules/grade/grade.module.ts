import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { GradeRepository } from './grade.repository';
import { gradeProviders } from './entities/grade.entity';
import { DatabaseModule } from 'src/core/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GradeController],
  providers: [GradeService,GradeRepository,...gradeProviders],
})
export class GradeModule {}
