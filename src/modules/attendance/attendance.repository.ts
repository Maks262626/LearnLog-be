import { Inject, Injectable } from '@nestjs/common';
import { Op, Transaction } from 'sequelize';
import { User } from '../user/entities/user.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceRepository {
  constructor(
    @Inject('ATTENDANCE_REPOSITORY')
    private attendanceRepository: typeof Attendance,
  ) {}

  async createAttendance(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    return await this.attendanceRepository.create({ ...createAttendanceDto });
  }

  async bulkCreate(
    instances: CreateAttendanceDto[],
    transaction?: Transaction,
  ): Promise<Attendance[]> {
    return await this.attendanceRepository.bulkCreate(instances, {
      validate: true,
      transaction,
    });
  }

  async findAllAttendances(): Promise<Attendance[]> {
    const attendances = await this.attendanceRepository.findAll();
    return attendances;
  }

  async findOneAttendance(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findByPk(id);
    return attendance;
  }

  async getBySubjectInstanceIds(subjectInstancesIds: string[]): Promise<Attendance[]> {
    const attendances = await this.attendanceRepository.findAll({
      where: {
        subject_instance_id: { [Op.in]: subjectInstancesIds },
      },
      include: [{ model: User }],
    });

    return attendances;
  }

  async getBySubjectInstanceId(subject_instance_id: string): Promise<Attendance[]> {
    const attendances = await this.attendanceRepository.findAll({
      where: { subject_instance_id },
      include: [{ model: User, attributes: ['id', 'first_name', 'last_name'] }],
      order: [
        [{ model: User, as: 'user' }, 'first_name', 'ASC'],
        [{ model: User, as: 'user' }, 'last_name', 'ASC'],
      ],
    });
    return attendances;
  }

  async getBySubjectInstanceAndUserId(
    subject_instance_id: string,
    user_id: string,
  ): Promise<Attendance> {
    const attendances = await this.attendanceRepository.findOne({
      where: { subject_instance_id, user_id },
    });
    return attendances;
  }

  async updateAttendance(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<boolean> {
    const attendance = await this.attendanceRepository.update(updateAttendanceDto, {
      where: { id },
    });
    return Boolean(attendance[0]);
  }

  async removeAttendance(id: string): Promise<boolean> {
    const attendance = await this.attendanceRepository.destroy({
      where: { id },
    });
    return Boolean(attendance[0]);
  }
}
