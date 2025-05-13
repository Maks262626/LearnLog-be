import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { UserModule } from '../user/user.module';
import { finalGradeProviders } from './entities/final-grade.entity';
import { FinalGradeController } from './final-grade.controller';
import { FinalGradeRepository } from './final-grade.repository';
import { FinalGradeService } from './final-grade.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule)],
  controllers: [FinalGradeController],
  providers: [FinalGradeService, FinalGradeRepository, ...finalGradeProviders],
})
export class FinalGradeModule {}
