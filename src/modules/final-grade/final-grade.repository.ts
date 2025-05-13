import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { CreateFinalGradeDto } from './dto/create-final-grade.dto';
import { UpdateFinalGradeDto } from './dto/update-final-grade.dto';
import { FinalGrade } from './entities/final-grade.entity';

@Injectable()
export class FinalGradeRepository {
  constructor(
    @Inject('FINAL_GRADE_REPOSITORY')
    private finalGradeRepository: typeof FinalGrade,
  ) {}

  async createFinalGrade(createFinalGradeDto: CreateFinalGradeDto): Promise<FinalGrade> {
    return this.finalGradeRepository.create({ ...createFinalGradeDto });
  }

  async bulkCreate(
    instances: CreateFinalGradeDto[],
    transaction?: Transaction,
  ): Promise<FinalGrade[]> {
    return this.finalGradeRepository.bulkCreate(instances, { validate: true, transaction });
  }

  async findAllFinalGrades(): Promise<FinalGrade[]> {
    const finalGrades = await this.finalGradeRepository.findAll();
    return finalGrades;
  }

  async findFinalGradeBySubjectAndUserId(
    subject_id: string,
    user_id: string,
  ): Promise<FinalGrade | null> {
    const finalGrade = await this.finalGradeRepository.findOne({
      where: { subject_id, user_id },
    });
    return finalGrade;
  }

  async findFinalGrade(id: string): Promise<FinalGrade> {
    const finalGrade = await this.finalGradeRepository.findByPk(id);
    return finalGrade;
  }

  async updateFinalGrade(id: string, updateFinalGradeDto: UpdateFinalGradeDto): Promise<boolean> {
    const finalGrade = await this.finalGradeRepository.update(updateFinalGradeDto, {
      where: { id },
    });
    return Boolean(finalGrade[0]);
  }

  async removeFinalGrade(id: string): Promise<boolean> {
    const finalGrade = await this.finalGradeRepository.destroy({
      where: { id },
    });
    return Boolean(finalGrade[0]);
  }
}
