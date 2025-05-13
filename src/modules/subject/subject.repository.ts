import { Inject, Injectable } from '@nestjs/common';
import { Op, Transaction } from 'sequelize';
import { FinalGrade } from '../final-grade/entities/final-grade.entity';
import { Group } from '../group/entities/group.entity';
import { User } from '../user/entities/user.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectRepository {
  constructor(
    @Inject('SUBJECT_REPOSITORY')
    private subjectRepository: typeof Subject,
  ) {}
  async createSubject(
    createSubjectDto: CreateSubjectDto,
    transaction?: Transaction,
  ): Promise<Subject> {
    return this.subjectRepository.create({ ...createSubjectDto }, { transaction });
  }

  async findAllSubjects(): Promise<Subject[]> {
    const subjects = await this.subjectRepository.findAll();
    return subjects;
  }

  async findSubject(id: string): Promise<Subject> {
    const subject = await this.subjectRepository.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'first_name', 'last_name'] },
        { model: Group, attributes: ['id', 'name'] },
        {
          model: FinalGrade,
          include: [{ model: User, attributes: ['id', 'first_name', 'last_name'] }],
        },
      ],
    });
    return subject;
  }

  async getMyCourses(groupsIds: string[]): Promise<Subject[]> {
    const subjects = await this.subjectRepository.findAll({
      where: {
        group_id: {
          [Op.in]: groupsIds,
        },
      },
      include: [
        { model: User, attributes: ['id', 'first_name', 'last_name'] },
        { model: Group, attributes: ['id', 'name'] },
      ],
    });

    return subjects;
  }

  async getSubjectsByGroupId(group_id: string): Promise<Subject[]> {
    const subjects = await this.subjectRepository.findAll({
      where: { group_id },
      include: [
        { model: User, attributes: ['id', 'first_name', 'last_name'] },
        { model: Group, attributes: ['id', 'name'] },
      ],
    });
    return subjects;
  }

  async getSubjectsByTeacherId(teacher_id: string): Promise<Subject[]> {
    const subjects = await this.subjectRepository.findAll({
      where: { teacher_id },
      include: [
        { model: User, attributes: ['id', 'first_name', 'last_name'] },
        { model: Group, attributes: ['id', 'name'] },
      ],
    });
    return subjects;
  }

  async updateSubject(id: string, updateSubjectDto: UpdateSubjectDto): Promise<boolean> {
    const subject = await this.subjectRepository.update(updateSubjectDto, {
      where: { id },
    });
    return Boolean(subject[0]);
  }

  async removeSubject(id: string): Promise<boolean> {
    const subject = await this.subjectRepository.destroy({ where: { id } });
    return Boolean(subject[0]);
  }
}
