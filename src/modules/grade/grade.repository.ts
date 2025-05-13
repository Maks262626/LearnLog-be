import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradeRepository {
  constructor(
    @Inject('GRADE_REPOSITORY')
    private gradeRepository: typeof Grade,
  ) {}

  async createGrade(createGradeDto: CreateGradeDto): Promise<Grade> {
    return this.gradeRepository.create({ ...createGradeDto });
  }

  async bulkCreate(instances: CreateGradeDto[], transaction?: Transaction): Promise<Grade[]> {
    return await this.gradeRepository.bulkCreate(instances, {
      validate: true,
      transaction,
    });
  }

  async findAllGrades(): Promise<Grade[]> {
    const grades = this.gradeRepository.findAll();
    return grades;
  }

  async findGrade(id: string): Promise<Grade> {
    const grade = this.gradeRepository.findByPk(id);
    return grade;
  }

  async getGradesByAssignmentId(assignment_id: string): Promise<Grade[]> {
    const grades = this.gradeRepository.findAll({ where: { assignment_id } });
    return grades;
  }

  async getGradeByUserIdAndAssignmentId(user_id: string, assignment_id: string): Promise<Grade> {
    const grade = this.gradeRepository.findOne({
      where: { assignment_id, user_id },
    });
    return grade;
  }

  async updateGrade(id: string, updateGradeDto: UpdateGradeDto): Promise<boolean> {
    const grade = this.gradeRepository.update(updateGradeDto, {
      where: { id },
    });
    return Boolean(grade[0]);
  }

  async removeGrade(id: string): Promise<boolean> {
    const grade = this.gradeRepository.destroy({ where: { id } });
    return Boolean(grade[0]);
  }
}
