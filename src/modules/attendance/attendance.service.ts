import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceRepository } from './attendance.repository';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository){}

  create(createAttendanceDto: CreateAttendanceDto):Promise<Attendance> {
    return this.attendanceRepository.createAttendance(createAttendanceDto);
  }

  findAll():Promise<Attendance[]> {
    return this.attendanceRepository.findAllAttendances();
  }

  findOne(id: string):Promise<Attendance> {
    return this.attendanceRepository.findOneAttendance(id);
  }

  update(id: string, updateAttendanceDto: UpdateAttendanceDto):Promise<boolean> {
    return this.attendanceRepository.updateAttendance(id,updateAttendanceDto);
  }

  remove(id: string):Promise<boolean> {
    return this.attendanceRepository.removeAttendance(id);
  }
}
