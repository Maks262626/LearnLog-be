import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { attendanceProviders } from '../attendance/entities/attendance.entity';
import { subjectProviders } from '../subject/entities/subject.entity';
import { SubjectRepository } from '../subject/subject.repository';
import { userProviders } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { subjectInstanceProviders } from './entities/subject-instance.entity';
import { SubjectInstanceController } from './subject-instance.controller';
import { SubjectInstanceRepository } from './subject-instance.repository';
import { SubjectInstanceService } from './subject-instance.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule)],
  controllers: [SubjectInstanceController],
  providers: [
    SubjectInstanceService,
    SubjectInstanceRepository,
    ...subjectInstanceProviders,
    SubjectRepository,
    ...subjectProviders,
    UserRepository,
    ...userProviders,
    AttendanceRepository,
    ...attendanceProviders,
  ],
})
export class SubjectInstanceModule {}
