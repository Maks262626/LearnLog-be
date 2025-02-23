import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { DatabaseModule } from 'src/core/database/database.module';
import { AttendanceRepository } from './attendance.repository';
import { attendanceProviders } from './entities/attendance.entity';

@Module({
  imports: [DatabaseModule],
  controllers: [AttendanceController],
  providers: [AttendanceService,AttendanceRepository,...attendanceProviders],
})
export class AttendanceModule {}
