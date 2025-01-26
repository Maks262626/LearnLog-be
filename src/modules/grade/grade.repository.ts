import { Inject, Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradeRepository {
  constructor(
    @Inject('GRADE_REPOSITORY')
    private gradeRepository: typeof Grade
  ){}

  async createGrade(createGradeDto: CreateGradeDto):Promise<Grade> {
    return this.gradeRepository.create({...createGradeDto});
  }

  async findAllGrades():Promise<Grade[]> {
    const grades = this.gradeRepository.findAll(); 
    return grades;
  }

  async findGrade(id: string):Promise<Grade> {
    const grade = this.gradeRepository.findByPk(id);
    return grade;
  }

  async updateGrade(id: string, updateGradeDto: UpdateGradeDto):Promise<boolean> {
    const grade = this.gradeRepository.update(updateGradeDto,{where:{id}});
    return Boolean(grade[0]);
  }

  async removeGrade(id: string):Promise<boolean> {
    const grade = this.gradeRepository.destroy({where:{id}});
    return Boolean(grade[0]);
  }
}
