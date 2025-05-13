import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Sequelize } from 'sequelize-typescript';
import { ErrorMap } from 'src/shared/response/error.map';
import { AttendanceRepository } from '../attendance/attendance.repository';
import { CreateAttendanceDto } from '../attendance/dto/create-attendance.dto';
import { AttendanceStatus } from '../attendance/entities/attendance.entity';
import { SubjectRepository } from '../subject/subject.repository';
import { User } from '../user/entities/user.entity';
import { UserPolicyService } from '../user/user-policy.service';
import { UserRepository } from '../user/user.repository';
import { CreateSubjectInstanceDto } from './dto/create-subject-instance.dto';
import { UpdateSubjectInstanceDto } from './dto/update-subject-instance.dto';
import { Day, SubjectInstance } from './entities/subject-instance.entity';
import { SubjectInstanceRepository } from './subject-instance.repository';

@Injectable()
export class SubjectInstanceService {
  constructor(
    private readonly policy: UserPolicyService,
    private readonly subjectInstanceRepository: SubjectInstanceRepository,
    private readonly subjectRepository: SubjectRepository,
    private readonly userRepository: UserRepository,
    private readonly attendancerepository: AttendanceRepository,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  async create(createSubjectInstanceDto: CreateSubjectInstanceDto): Promise<SubjectInstance> {
    const transaction = await this.sequelize.transaction();
    try {
      const subjectInstance = await this.subjectInstanceRepository.createSubjectInstance(
        createSubjectInstanceDto,
        transaction,
      );

      const { subject_id } = createSubjectInstanceDto;
      const subject = await this.subjectRepository.findSubject(subject_id);
      const { group_id } = subject;
      const users = await this.userRepository.findUsersFromGroup(group_id);
      const attendances: CreateAttendanceDto[] = [];
      for (const user of users) {
        const attendance: CreateAttendanceDto = {
          subject_instance_id: subjectInstance.id,
          user_id: user.id,
          status: AttendanceStatus.ABSENT,
        };
        attendances.push(attendance);
      }
      await this.attendancerepository.bulkCreate(attendances, transaction);
      await transaction.commit();
      return subjectInstance;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  findAll(): Promise<SubjectInstance[]> {
    return this.subjectInstanceRepository.findAllSubjectInstances();
  }

  findOne(id: string): Promise<SubjectInstance> {
    return this.subjectInstanceRepository.findSubjectInstance(id);
  }

  findSubjectInstancesBySubjectId(
    subject_id: string,
    callerUser: User,
  ): Promise<SubjectInstance[]> {
    if (!this.policy.isHasPermissionBySubjectId(subject_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.subjectInstanceRepository.findSubjectInstancesBySubjectId(subject_id);
  }

  async getByGroup(
    group_id: string,
    startDate: Date,
    endDate: Date,
    callerUser?: User,
  ): Promise<Record<Day, SubjectInstance[]>> {
    if (callerUser && !this.policy.isManagerHasPermissionByGroupId(group_id, callerUser)) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    const subjects = await this.subjectRepository.getSubjectsByGroupId(group_id);
    const subjectsIds = subjects.map((s) => s.id);
    const subjectInstances =
      await this.subjectInstanceRepository.findSubjectsInstancesBySubjectsIds(
        subjectsIds,
        startDate,
        endDate,
      );
    return this.mapLecturesByDay(subjectInstances);
  }

  async getTeachersSchedule(
    teacher_id: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Record<Day, SubjectInstance[]>> {
    const subjects = await this.subjectRepository.getSubjectsByTeacherId(teacher_id);
    const subjectIds = subjects.map((s) => s.id);
    const subjectInstances =
      await this.subjectInstanceRepository.findSubjectsInstancesBySubjectsIds(
        subjectIds,
        startDate,
        endDate,
      );
    return this.mapLecturesByDay(subjectInstances);
  }

  mapLecturesByDay(subjectInstances: SubjectInstance[]): Record<Day, SubjectInstance[]> {
    const daysMap: Record<number, Day> = {
      0: 'Sun',
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat',
    };
    const lecturesByDay: Record<Day, SubjectInstance[]> = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    };
    for (const instance of subjectInstances) {
      const date = dayjs(instance.date);
      const dayNumber = date.day();
      const dayName = daysMap[dayNumber];

      lecturesByDay[dayName].push(instance);
    }

    return lecturesByDay;
  }

  update(
    subject_instance_id: string,
    updateSubjectInstanceDto: UpdateSubjectInstanceDto,
    callerUser: User,
  ): Promise<boolean> {
    if (
      callerUser &&
      !this.policy.isHasPermissionBySubjectInstanceId(subject_instance_id, callerUser)
    ) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }

    return this.subjectInstanceRepository.updateSubjectInstance(
      subject_instance_id,
      updateSubjectInstanceDto,
    );
  }

  remove(subject_instance_id: string, callerUser: User): Promise<boolean> {
    if (
      callerUser &&
      !this.policy.isHasPermissionBySubjectInstanceId(subject_instance_id, callerUser)
    ) {
      throw new ForbiddenException(ErrorMap.FORBIDDEN_ERROR);
    }
    return this.subjectInstanceRepository.removeSubjectInstance(subject_instance_id);
  }
}
