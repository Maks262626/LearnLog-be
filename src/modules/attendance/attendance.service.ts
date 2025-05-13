import { ForbiddenException, Injectable } from '@nestjs/common';
import { ErrorMap } from 'src/shared/response/error.map';
import { User } from '../user/entities/user.entity';
import { UserPolicyService } from '../user/user-policy.service';
import { AttendanceRepository } from './attendance.repository';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly policy: UserPolicyService,
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

  create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    return this.attendanceRepository.createAttendance(createAttendanceDto);
  }

  findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.findAllAttendances();
  }

  findOne(id: string): Promise<Attendance> {
    return this.attendanceRepository.findOneAttendance(id);
  }

  getBySubjectInstanceId(subject_instance_id: string, callerUser: User): Promise<Attendance[]> {
    if (!this.policy.isHasPermissionBySubjectInstanceId(subject_instance_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.attendanceRepository.getBySubjectInstanceId(subject_instance_id);
  }

  update(
    attendance_id: string,
    updateAttendanceDto: UpdateAttendanceDto,
    callerUser: User,
  ): Promise<boolean> {
    if (!this.policy.isHasPermissionByAttendanceId(attendance_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.attendanceRepository.updateAttendance(attendance_id, updateAttendanceDto);
  }

  remove(id: string): Promise<boolean> {
    return this.attendanceRepository.removeAttendance(id);
  }
}
