import { Module } from '@nestjs/common';
import { FinalGradeService } from './final-grade.service';
import { FinalGradeController } from './final-grade.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { FinalGradeRepository } from './final-grade.repository';
import { finalGradeProviders } from './entities/final-grade.entity';

@Module({
  imports: [DatabaseModule],
  controllers: [FinalGradeController],
  providers: [FinalGradeService, FinalGradeRepository, ...finalGradeProviders],
})
export class FinalGradeModule {}
