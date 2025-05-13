import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/core/database/database.module';
import { subjectInstanceProviders } from '../subject-instance/entities/subject-instance.entity';
import { SubjectInstanceRepository } from '../subject-instance/subject-instance.repository';
import { UserModule } from '../user/user.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceService } from './attendance.service';
import { attendanceProviders } from './entities/attendance.entity';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule)],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    AttendanceRepository,
    ...attendanceProviders,
    SubjectInstanceRepository,
    ...subjectInstanceProviders,
  ],
})
export class AttendanceModule {}
