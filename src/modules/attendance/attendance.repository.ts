import { Inject, Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceRepository {
  constructor(
    @Inject('ATTENDANCE_REPOSITORY')
    private attendanceRepository: typeof Attendance
  ){}

  async createAttendance(createAttendanceDto: CreateAttendanceDto):Promise<Attendance> {
    return await this.attendanceRepository.create({...createAttendanceDto});
  }

  async findAllAttendances():Promise<Attendance[]> {
    const attendances = await this.attendanceRepository.findAll();
    return attendances;
  }

  async findOneAttendance(id: string):Promise<Attendance> {
    const attendance = await this.attendanceRepository.findByPk(id);
    return attendance;
  }

  async updateAttendance(id: string, updateAttendanceDto: UpdateAttendanceDto):Promise<boolean> {
    const attendance = await this.attendanceRepository.update(updateAttendanceDto,{where:{id}});
    return Boolean(attendance[0]);
  }

  async removeAttendance(id: string):Promise<boolean> {
    const attendance = await this.attendanceRepository.destroy({where:{id}});
    return Boolean(attendance[0]);
  }
}
