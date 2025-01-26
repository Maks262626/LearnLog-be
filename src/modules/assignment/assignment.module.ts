import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { AssignmentRepository } from './assignment.repository';
import { assignmentProviders } from './entities/assignment.entity';

@Module({
  imports: [DatabaseModule],
  controllers: [AssignmentController],
  providers: [AssignmentService,AssignmentRepository,...assignmentProviders],
})
export class AssignmentModule {}
