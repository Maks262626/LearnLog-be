import { Inject, Injectable } from '@nestjs/common';
import { Op, Transaction } from 'sequelize';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Group } from '../group/entities/group.entity';
import { Subject } from '../subject/entities/subject.entity';
import { User } from '../user/entities/user.entity';
import { CreateSubjectInstanceDto } from './dto/create-subject-instance.dto';
import { UpdateSubjectInstanceDto } from './dto/update-subject-instance.dto';
import { SubjectInstance } from './entities/subject-instance.entity';

@Injectable()
export class SubjectInstanceRepository {
  constructor(
    @Inject('SUBJECT_INSTANCE_REPOSITORY')
    private subjectInstanceRepository: typeof SubjectInstance,
  ) {}

  async createSubjectInstance(
    createSubjectInstanceDto: CreateSubjectInstanceDto,
    transaction?: Transaction,
  ): Promise<SubjectInstance> {
    return await this.subjectInstanceRepository.create(
      { ...createSubjectInstanceDto },
      { transaction },
    );
  }

  async bulkCreate(instances: CreateSubjectInstanceDto[]): Promise<SubjectInstance[]> {
    return await this.subjectInstanceRepository.bulkCreate(instances, {
      validate: true,
    });
  }

  async findAllSubjectInstances(): Promise<SubjectInstance[]> {
    const subjectInstance = await this.subjectInstanceRepository.findAll();
    return subjectInstance;
  }

  async findSubjectInstance(id: string): Promise<SubjectInstance> {
    const subjectInstance = await this.subjectInstanceRepository.findByPk(id);
    return subjectInstance;
  }

  async findSubjectInstancesBySubjectId(
    subject_id: string,
    withInclude: boolean = true,
  ): Promise<SubjectInstance[]> {
    const subjectInstances = await this.subjectInstanceRepository.findAll({
      where: { subject_id },
      order: [['date', 'ASC']],
      include: withInclude
        ? [
            {
              model: Subject,
              attributes: ['id', 'name'],
              include: [{ model: Group, attributes: ['id', 'name'] }],
            },
            {
              model: Attendance,
              include: [{ model: User, attributes: ['id', 'first_name', 'last_name'] }],
            },
          ]
        : [],
    });

    return subjectInstances;
  }

  async findSubjectsInstancesBySubjectsIds(
    subjectsIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<SubjectInstance[]> {
    const subjectInstances = await this.subjectInstanceRepository.findAll({
      where: {
        subject_id: {
          [Op.in]: subjectsIds,
        },
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Subject,
          attributes: ['id', 'name'],
          include: [{ model: Group, attributes: ['id', 'name'] }],
        },
      ],
    });

    return subjectInstances;
  }

  async updateSubjectInstance(
    id: string,
    updateSubjectInstanceDto: UpdateSubjectInstanceDto,
  ): Promise<boolean> {
    const subjectInstance = await this.subjectInstanceRepository.update(updateSubjectInstanceDto, {
      where: { id },
    });
    return Boolean(subjectInstance[0]);
  }

  async removeSubjectInstance(id: string): Promise<boolean> {
    const subjectInstance = await this.subjectInstanceRepository.destroy({
      where: { id },
    });
    return Boolean(subjectInstance[0]);
  }
}
