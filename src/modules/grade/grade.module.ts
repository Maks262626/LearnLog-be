import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { UserModule } from '../user/user.module';
import { gradeProviders } from './entities/grade.entity';
import { GradeController } from './grade.controller';
import { GradeRepository } from './grade.repository';
import { GradeService } from './grade.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule)],
  controllers: [GradeController],
  providers: [GradeService, GradeRepository, ...gradeProviders],
})
export class GradeModule {}
